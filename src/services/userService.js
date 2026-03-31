import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'Users'

// low-level fetch wrapper
async function callApi(action, method = 'GET', body) {
  const url = buildUrl(action, method === 'GET' ? { sheetName: SHEET_NAME } : {})
  const payload = body ? { ...body, sheetName: SHEET_NAME } : { sheetName: SHEET_NAME }
  const opts =
    method === 'GET'
      ? { method: 'GET' }
      : {
          method: 'POST',
          // Use a "simple" content-type to avoid browser preflight (Apps Script doesn't handle OPTIONS)
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
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

export async function listUsers() {
  return callApi('list', 'GET')
}

export async function getUser(id) {
  const res = await listUsers()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createUser(user) {
  return callApi('create', 'POST', user)
}

export async function updateUser(user) {
  return callApi('update', 'POST', user)
}

export async function deleteUser(userId) {
  console.log('userService.deleteUser called with userId:', userId);
  const result = await callApi('delete', 'POST', { id: userId });
  console.log('userService.deleteUser result:', result);
  return result;
}

export async function login(credentials) {
  console.log('userService.login called with:', credentials.username);
  const result = await callApi('login', 'POST', credentials);
  console.log('userService.login result:', result);
  return result;
}

export async function logout(userId) {
  console.log('userService.logout called with userId:', userId);
  const result = await callApi('logout', 'POST', { userId });
  console.log('userService.logout result:', result);
  return result;
}

export async function uploadImage(filename, dataUrl) {
  // server-side Code.gs will use its DRIVE_FOLDER_ID by default
  const res = await callApi('uploadImage', 'POST', { filename, dataUrl })
  // normalize response: expect { url, id } on success
  const url = (res && res.data && res.data.url) || (res && res.url) || null
  const id = (res && res.data && res.data.id) || (res && res.id) || null
  if (url) return { url, id }
  throw new Error((res && res.error) ? String(res.error) : 'uploadImage failed')
}

const userService = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  uploadImage,
}

export default userService
