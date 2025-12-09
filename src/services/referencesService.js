import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'references'

// low-level fetch wrapper
async function callApi(action, method = 'GET', body) {
  const url = buildUrl(action, method === 'GET' ? { sheetName: SHEET_NAME } : {})
  const payload = body ? { ...body, sheetName: SHEET_NAME } : { sheetName: SHEET_NAME }
  const opts =
    method === 'GET'
      ? { method: 'GET' }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        }

  try {
    const res = await fetch(url, opts)
    const text = await res.text()
    try {
      const json = JSON.parse(text)
      return json
    } catch (e) {
      throw new Error(`Non-JSON response from API: ${text}`)
    }
  } catch (err) {
    console.error('[referencesService] callApi error', action, err)
    throw err
  }
}

export async function listReferences() {
  return callApi('list', 'GET')
}

export async function getReference(id) {
  const res = await listReferences()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createReference(reference) {
  return callApi('create', 'POST', reference)
}

export async function updateReference(reference) {
  return callApi('update', 'POST', reference)
}

export async function deleteReference(referenceId) {
  return callApi('delete', 'POST', { id: referenceId })
}

export async function uploadImage(filename, dataUrl) {
  const res = await callApi('uploadImage', 'POST', { filename, dataUrl })
  if (res && res.url) return { url: res.url, id: res.id || null }
  throw new Error(res && res.error ? String(res.error) : 'uploadImage failed')
}

const referencesService = {
  listReferences,
  getReference,
  createReference,
  updateReference,
  deleteReference,
  uploadImage,
}

export default referencesService