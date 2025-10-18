import { buildUrl } from '../api/googleAppsApi'

// low-level fetch wrapper
async function callApi(action, method = 'GET', body) {
  const url = buildUrl(action)
  const opts =
    method === 'GET'
      ? { method: 'GET' }
      : {
          method: 'POST',
          // Use a "simple" content-type to avoid browser preflight (Apps Script doesn't handle OPTIONS)
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(body || {}),
        }

  try {
    const res = await fetch(url, opts)
    const text = await res.text()
    // try parse JSON, otherwise return raw text
    try {
      const json = JSON.parse(text)
      return json
    } catch (e) {
      // non-json response
      throw new Error(`Non-JSON response from API: ${text}`)
    }
  } catch (err) {
    console.error('[userService] callApi error', action, err)
    throw err
  }
}

export async function listItems() {
  return callApi('list', 'GET')
}

export async function getUser(id) {
  const res = await listItems()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createItem(item) {
  return callApi('create', 'POST', item)
}

export async function updateItem(item) {
  return callApi('update', 'POST', item)
}

export async function deleteItem(itemId) {
  return callApi('delete', 'POST', { id: itemId })
}

export async function uploadImage(filename, dataUrl) {
  // server-side Code.gs will use its DRIVE_FOLDER_ID by default
  const res = await callApi('uploadImage', 'POST', { filename, dataUrl })
  // normalize response: expect { url, id } on success
  if (res && res.url) return { url: res.url, id: res.id || null }
  throw new Error(res && res.error ? String(res.error) : 'uploadImage failed')
}

const userService = {
  listItems,
  getUser,
  createItem,
  updateItem,
  deleteItem,
  uploadImage,
}

export default userService
