// Paste this entire file into your Apps Script project

// default values (use raw IDs or full URLs — extractor will handle both)
const SPREADSHEET_ID = '1WmqpAC0AHJk3a9h8MLo8eEyFwBnn1pO6gvCJnDOhwZo'
const SHEET_NAME = 'Sheet1'
const DRIVE_FOLDER_ID = '1m8Hk71nviFWt0bglSzbru0LCat8OCvrb'

// logging sheet constants (moved here)
const LOG_SHEET_NAME = 'Logs'
const LOG_HEADERS = ['timestamp','level','message','meta']

const DEFAULT_HEADERS = ['id','name','bio','profileImageUrl']

// normalize a value to an ID (accepts raw id or full URL)
function _extractId(v) {
  if (!v) return ''
  // spreadsheet / file id pattern
  const dMatch = v.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (dMatch) return dMatch[1]
  // url like ?id=...
  const idParam = v.match(/[?&]id=([a-zA-Z0-9-_]+)/)
  if (idParam) return idParam[1]
  // drive folder pattern
  const folderMatch = v.match(/folders\/([a-zA-Z0-9-_]+)/)
  if (folderMatch) return folderMatch[1]
  // assume it's already an id
  return v
}

// helper to choose id from body / query param / fallback constant
function _getSpreadsheetId(e, body) {
  const raw = (body && body.spreadsheetId) || (e && e.parameter && e.parameter.spreadsheetId) || SPREADSHEET_ID
  return _extractId(raw)
}
function _getDriveFolderId(body) {
  const raw = (body && body.folderId) || DRIVE_FOLDER_ID
  return _extractId(raw)
}

// helper: generate a compact unique id (timestamp + random)
function _generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8)
}

// Ensure the sheet exists and has a header row. If the header row is empty, write DEFAULT_HEADERS.
// Returns the sheet object.
function ensureSheetAndHeaders(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName)
  if (!sheet) {
    sheet = ss.insertSheet(sheetName)
    const maxCols = Math.max(0, sheet.getMaxColumns())
    const needed = Math.max(0, DEFAULT_HEADERS.length - maxCols)
    if (needed > 0) {
      if (maxCols === 0) {
        sheet.insertColumns(1, needed)
      } else {
        sheet.insertColumnsAfter(maxCols, needed)
      }
    }
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS])
    return sheet
  }

  const maxCols = Math.max(0, sheet.getMaxColumns())
  if (maxCols < DEFAULT_HEADERS.length) {
    const diff = DEFAULT_HEADERS.length - maxCols
    if (maxCols === 0) {
      sheet.insertColumns(1, diff)
    } else {
      sheet.insertColumnsAfter(maxCols, diff)
    }
  }

  const lastCol = Math.max(1, sheet.getLastColumn(), DEFAULT_HEADERS.length)
  const firstRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0] || []
  const hasAnyHeader = firstRow.some(v => v !== '' && v !== null && v !== undefined)
  if (!hasAnyHeader) {
    sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS])
  }
  return sheet
}

function doGet(e) {
  // preserve existing routing
  if (e.parameter && e.parameter.action === 'getImage' && e.parameter.fileId) {
    return getImageProxy(e.parameter.fileId)
  }
  const action = (e && e.parameter && e.parameter.action) || 'list'
  if (action === 'list') return listItems(e)
  return ContentService.createTextOutput(JSON.stringify({ error: 'invalid action' })).setMimeType(ContentService.MimeType.JSON)
}

function getImageProxy(fileId) {
  try {
    const fid = _extractId(fileId || '')
    const file = DriveApp.getFileById(fid)
    const blob = file.getBlob()
    const base64 = Utilities.base64Encode(blob.getBytes())
    const dataUrl = 'data:' + blob.getContentType() + ';base64,' + base64
    return ContentService.createTextOutput(JSON.stringify({ dataUrl })).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON)
  }
}

// new: append a log row to a "Sheet2" sheet (timestamp, level, message, meta JSON)
function logs(level, msg, meta) {
  try {
    const ssId = _extractId(SPREADSHEET_ID)
    const ss = SpreadsheetApp.openById(ssId)
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME)
    if (!logSheet) {
      logSheet = ss.insertSheet(LOG_SHEET_NAME)
      logSheet.getRange(1,1,1,LOG_HEADERS.length).setValues([LOG_HEADERS])
    }
    const ts = new Date()
    const metaStr = meta ? JSON.stringify(meta) : ''
    logSheet.appendRow([ts, level, msg, metaStr])
  } catch (e) {
    // log failure so you can inspect it in Executions -> Logs
    try { Logger.log('logs() failed: %s; original msg: %s; meta: %s', String(e), msg, JSON.stringify(meta)) } catch(_) {}
  }
}

function doPost(e) {
  logs('INFO', 'doPost start', { params: e && e.parameter })
  const action = e.parameter && e.parameter.action
  const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {}
  logs('DEBUG', 'doPost parsed body', { action, keys: Object.keys(body || {}) })

  if (e.parameter && e.parameter.debug === '1') {
    return ContentService.createTextOutput(JSON.stringify({ ok:true, action, body, params: e.parameter })).setMimeType(ContentService.MimeType.JSON)
  }

  if (action === 'create') return createItem(body)
  if (action === 'update') return updateItem(body)
  if (action === 'delete') return deleteItem(body)
  if (action === 'uploadImage') return uploadImage(body)
  return ContentService.createTextOutput(JSON.stringify({ error: 'invalid action' })).setMimeType(ContentService.MimeType.JSON)
}

// listItems
function listItems(e) {
  const ssId = _getSpreadsheetId(e)
  if (!ssId) return ContentService.createTextOutput(JSON.stringify({ error: 'missing spreadsheet id' })).setMimeType(ContentService.MimeType.JSON)

  const ss = SpreadsheetApp.openById(ssId)
  const sheet = ensureSheetAndHeaders(ss, SHEET_NAME)
  const rows = sheet.getDataRange().getValues()
  if (rows.length <= 1) return ContentService.createTextOutput(JSON.stringify({ data: [] })).setMimeType(ContentService.MimeType.JSON)

  const headers = rows.shift()
  const data = []
  const lcHeaders = headers.map(h => (h || '').toString().toLowerCase())
  const profileCol = lcHeaders.indexOf('profileimageurl')

  // accumulate cell updates to persist normalized uc URLs
  const updates = []

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    const obj = {}
    headers.forEach((h, i) => obj[h] = row[i])

    if (profileCol !== -1) {
      const cur = String(row[profileCol] || '')
      const uc = _toUcUrl(cur)
      if (cur && uc && uc !== cur) {
        // persist normalized uc URL for this single row
        updates.push({ sheetRow: r + 2, col: profileCol + 1, value: uc })
        obj[headers[profileCol]] = uc
      }
    }

    data.push(obj)
  }

  // write updates (best-effort, per-cell)
  if (updates.length) {
    updates.forEach(u => {
      try {
        sheet.getRange(u.sheetRow, u.col).setValue(u.value)
      } catch (e) {
        logs('WARN', 'failed to persist uc url', { err: String(e) })
      }
    })
  }

  return ContentService.createTextOutput(JSON.stringify({ data })).setMimeType(ContentService.MimeType.JSON)
}

// createItem — does NOT modify header row/columns; id is auto-generated if missing
function createItem(item) {
  try {
    logs('INFO', 'createItem start', { item })
    const ssId = _getSpreadsheetId(null, item)
    logs('DEBUG', 'resolved spreadsheet id', { ssId })
    if (!ssId) {
      logs('ERROR', 'missing spreadsheet id', { item })
      return ContentService.createTextOutput(JSON.stringify({ error: 'missing spreadsheet id' })).setMimeType(ContentService.MimeType.JSON)
    }

    const ss = SpreadsheetApp.openById(ssId)
    const sheet = ensureSheetAndHeaders(ss, SHEET_NAME)
    logs('DEBUG', 'opened sheet', { sheetName: SHEET_NAME })

    // handle image upload OR normalize provided URL/id
    if (item.imageDataUrl && item.imageFilename) {
      logs('INFO', 'imageDataUrl provided, uploading', { filename: item.imageFilename })
      const m = String(item.imageDataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/)
      if (!m) {
        logs('ERROR', 'invalid image dataUrl', { item })
        return ContentService.createTextOutput(JSON.stringify({ error: 'invalid image dataUrl' })).setMimeType(ContentService.MimeType.JSON)
      }
      const blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], item.imageFilename)
      const folderId = _getDriveFolderId(item)
      logs('DEBUG', 'drive folder id', { folderId })
      if (!folderId) {
        logs('ERROR', 'missing drive folder id', { item })
        return ContentService.createTextOutput(JSON.stringify({ error: 'missing drive folder id' })).setMimeType(ContentService.MimeType.JSON)
      }
      const folder = DriveApp.getFolderById(folderId)
      const file = folder.createFile(blob)
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
      logs('INFO', 'uploaded file', { fileId: file.getId() })
      item.profileImageUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId()
      item.imageId = file.getId()
    } else if (item.profileImageUrl) {
      logs('INFO', 'profileImageUrl provided', { profileImageUrl: item.profileImageUrl })
      const fid = _extractId(item.profileImageUrl)
      logs('DEBUG', 'extracted fid', { fid })
      if (fid) {
        try {
          DriveApp.getFileById(fid).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
          logs('DEBUG', 'set sharing on fid', { fid })
        } catch (e) {
          logs('WARN', 'setSharing failed', { fid, err: String(e) })
        }
        item.profileImageUrl = 'https://drive.google.com/uc?export=view&id=' + fid
        item.imageId = fid
      } else {
        item.profileImageUrl = _toUcUrl(item.profileImageUrl)
        logs('DEBUG', 'normalized profileImageUrl', { profileImageUrl: item.profileImageUrl })
      }
    } else {
      logs('DEBUG', 'no image provided')
    }

    // simple id generation: use next sheet row number (as string)
    const nextRow = sheet.getLastRow() + 1
    logs('DEBUG', 'nextRow computed', { nextRow })
    if (!item.id) item.id = String(Math.max(1, nextRow - 1))
    logs('DEBUG', 'assigned id', { id: item.id })

    // read headers and prepare row
    const headerCols = Math.max(1, sheet.getLastColumn(), DEFAULT_HEADERS.length)
    const headers = sheet.getRange(1, 1, 1, headerCols).getValues()[0].map(h => (h === null || h === undefined) ? '' : String(h).trim())
    const lcHeaders = headers.map(h => h.toLowerCase())
    logs('DEBUG', 'headers', { headers })

    const itemKeys = Object.keys(item || {})
    const row = headers.map(h => {
      if (String(h).toLowerCase() === 'id') return item.id
      const keyMatch = itemKeys.find(k => k.toLowerCase() === String(h).toLowerCase())
      return keyMatch ? item[keyMatch] : ''
    })
    logs('DEBUG', 'row to write', { row })

    if (item.profileImageUrl) item.profileImageUrl = _toUcUrl(item.profileImageUrl)

    sheet.getRange(nextRow, 1, 1, row.length).setValues([row])
    logs('INFO', 'wrote row', { nextRow })

    const profileColIndex = lcHeaders.indexOf('profileimageurl')
    if (profileColIndex !== -1) {
      const uc = item.profileImageUrl ? _toUcUrl(item.profileImageUrl) : ''
      sheet.getRange(nextRow, profileColIndex + 1).setValue(uc)
      item.profileImageUrl = uc
      logs('DEBUG', 'wrote profileImageUrl to column', { col: profileColIndex + 1, uc })
    }

    logs('INFO', 'createItem success', { id: item.id })
    return ContentService.createTextOutput(JSON.stringify({ success: true, id: item.id, profileImageUrl: item.profileImageUrl || '' })).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    logs('ERROR', 'createItem error', { err: String(err) })
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON)
  }
}

// updateItem
function updateItem(item) {
  try {
    const ssId = _getSpreadsheetId(null, item)
    if (!ssId) return ContentService.createTextOutput(JSON.stringify({ error: 'missing spreadsheet id' })).setMimeType(ContentService.MimeType.JSON)

    // If updating with image data, upload it first and set profileImageUrl + imageId
    let newImageId = null
    if (item.imageDataUrl && item.imageFilename) {
      const match = String(item.imageDataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/)
      if (match) {
        const mimeType = match[1]
        const base64 = match[2]
        const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, item.imageFilename)
        const folderId = _getDriveFolderId(item)
        if (!folderId) {
          return ContentService.createTextOutput(JSON.stringify({ error: 'missing drive folder id' })).setMimeType(ContentService.MimeType.JSON)
        }
        const folder = DriveApp.getFolderById(folderId)
        const file = folder.createFile(blob)
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
        item.profileImageUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId()
        item.imageId = file.getId()
        newImageId = file.getId()
      } else {
        return ContentService.createTextOutput(JSON.stringify({ error: 'invalid image dataUrl' })).setMimeType(ContentService.MimeType.JSON)
      }
    } else {
      // normalize any provided profileImageUrl; if it's a Drive file id/url attempt to set sharing and persist uc + imageId
      if (item.profileImageUrl) {
        const fid = _extractId(item.profileImageUrl)
        if (fid) {
          try {
            DriveApp.getFileById(fid).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
          } catch (e) {
            logs('WARN', 'updateItem: setSharing failed', { fid, err: String(e) })
          }
          item.profileImageUrl = 'https://drive.google.com/uc?export=view&id=' + fid
          item.imageId = fid
        } else {
          item.profileImageUrl = _toUcUrl(item.profileImageUrl)
        }
      }
    }

    const ss = SpreadsheetApp.openById(ssId)
    const sheet = ensureSheetAndHeaders(ss, SHEET_NAME)
    const rows = sheet.getDataRange().getValues()
    const headers = rows[0]
    const lcHeaders = headers.map(h => (h || '').toString().toLowerCase())
    const idIndex = lcHeaders.indexOf('id')
    const imageIdIndex = lcHeaders.indexOf('imageid')
    const profileColIndex = lcHeaders.indexOf('profileimageurl')
 
    if (idIndex === -1) return ContentService.createTextOutput(JSON.stringify({ error: 'no id column' })).setMimeType(ContentService.MimeType.JSON)
    for (let r = 1; r < rows.length; r++) {
      if (rows[r][idIndex] == item.id) {
        // prefer explicit imageId column, otherwise extract id from existing profileImageUrl cell
        const existingProfileUrl = profileColIndex !== -1 ? String(rows[r][profileColIndex] || '') : ''
        const existingImageId = (imageIdIndex !== -1) ? String(rows[r][imageIdIndex] || '') : (_extractId(existingProfileUrl) || '')

        // write updated values to the row
        const itemKeys = Object.keys(item || {})
        headers.forEach((h, i) => {
          const matchKey = itemKeys.find(k => String(k).toLowerCase() === String(h).toLowerCase())
          if (matchKey && item[matchKey] !== undefined) sheet.getRange(r + 1, i + 1).setValue(item[matchKey])
        })

        // ensure profileImageUrl cell is normalized/updated for this row
        if (profileColIndex !== -1) {
          const uc = item.profileImageUrl ? _toUcUrl(item.profileImageUrl) : ''
          sheet.getRange(r + 1, profileColIndex + 1).setValue(uc)
          item.profileImageUrl = uc
        }
        
        // if a new image was uploaded, remove the previous Drive file (best-effort)
        if (newImageId && existingImageId && existingImageId !== newImageId) {
          try {
            DriveApp.getFileById(existingImageId).setTrashed(true)
          } catch (e) {
            logs('WARN', 'failed to trash previous image', { err: String(e) })
          }
        }

        // persist the new imageId into the imageId column (if header exists)
        if (item.imageId && imageIdIndex !== -1) {
          sheet.getRange(r + 1, imageIdIndex + 1).setValue(item.imageId)
        }
        
        return ContentService.createTextOutput(JSON.stringify({ success: true, profileImageUrl: item.profileImageUrl || '' })).setMimeType(ContentService.MimeType.JSON)
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ error: 'not found' })).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    logs('ERROR', 'updateItem error', { err: String(err) })
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON)
  }
}

function deleteItem(item) {
  const ssId = _getSpreadsheetId(null, item)
  if (!ssId) return ContentService.createTextOutput(JSON.stringify({ error: 'missing spreadsheet id' })).setMimeType(ContentService.MimeType.JSON)

  const ss = SpreadsheetApp.openById(ssId)
  const sheet = ensureSheetAndHeaders(ss, SHEET_NAME)
  const rows = sheet.getDataRange().getValues()
  const headers = rows[0]
  const lcHeaders = headers.map(h => (h || '').toString().toLowerCase())
  const idIndex = lcHeaders.indexOf('id')
  const imageIdIndex = lcHeaders.indexOf('imageid')

  if (idIndex === -1) return ContentService.createTextOutput(JSON.stringify({ error: 'no id column' })).setMimeType(ContentService.MimeType.JSON)
  for (let r = 1; r < rows.length; r++) {
    if (rows[r][idIndex] == item.id) {
      // try imageId column first; otherwise extract id from profileImageUrl cell
      const profileColIndex = lcHeaders.indexOf('profileimageurl')
      const existingProfileUrl = profileColIndex !== -1 ? String(rows[r][profileColIndex] || '') : ''
      const existingImageId = (imageIdIndex !== -1) ? String(rows[r][imageIdIndex] || '') : (_extractId(existingProfileUrl) || '')
       if (existingImageId) {
         try {
           DriveApp.getFileById(existingImageId).setTrashed(true)
         } catch (e) {
           logs('WARN', 'failed to trash image on delete', { err: String(e) })
         }
       }
       sheet.deleteRow(r + 1)
       return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
     }
   }
  return ContentService.createTextOutput(JSON.stringify({ error: 'not found' })).setMimeType(ContentService.MimeType.JSON)
}

// uploadImage
function uploadImage(body){
  if (!body || !body.dataUrl || !body.filename) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'missing filename or dataUrl' })).setMimeType(ContentService.MimeType.JSON)
  }
  const match = body.dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)
  if (!match) return ContentService.createTextOutput(JSON.stringify({ error: 'invalid dataUrl' })).setMimeType(ContentService.MimeType.JSON)

  const mimeType = match[1]
  const base64 = body.dataUrl.split(',')[1]
  const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, body.filename)
  const folderId = _getDriveFolderId(body)
  if (!folderId) return ContentService.createTextOutput(JSON.stringify({ error: 'missing drive folder id' })).setMimeType(ContentService.MimeType.JSON)

  const folder = DriveApp.getFolderById(folderId)
  const file = folder.createFile(blob)
  // make file readable by anyone with link
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  const ucUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId()
  return ContentService.createTextOutput(JSON.stringify({ url: ucUrl, id: file.getId() })).setMimeType(ContentService.MimeType.JSON)
}


// normalize a Drive/file URL into an embeddable "uc" URL (or return unchanged)
function _toUcUrl(v) {
  if (!v) return v
  const s = String(v)
  // already a uc url
  if (s.indexOf('drive.google.com/uc') !== -1) return s
  const m = s.match(/\/d\/([a-zA-Z0-9_-]+)/) || s.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (m) return 'https://drive.google.com/uc?export=view&id=' + m[1]
  return s
}
