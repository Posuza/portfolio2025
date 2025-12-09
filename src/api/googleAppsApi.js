// Replace inline fetch with a simple config + helpers.
// Apps Script spreadsheet/drive IDs are handled server-side (Code.gs).

export let BASE_URL = process.env.REACT_APP_APPS_SCRIPT_URL || ''

export function setBaseUrl(url) {
  BASE_URL = url || BASE_URL
}

export function buildUrl(action, params = {}) {
  if (!BASE_URL) throw new Error('BASE_URL not configured')
  const u = new URL(BASE_URL)
  u.searchParams.set('action', action)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) u.searchParams.set(key, value)
  })
  return u.toString()
}

export async function callApi(action, method = 'GET', body = null, params = {}) {
  const url = method === 'GET' ? buildUrl(action, params) : buildUrl(action)
  const opts =
    method === 'GET'
      ? { method: 'GET' }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'plain/text' },
          body: JSON.stringify(body || {}),
        }

  const res = await fetch(url, opts)
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

const googleAppsApi = {
  setBaseUrl,
  buildUrl,
  callApi,
  get config() {
    return { BASE_URL }
  },
}

export default googleAppsApi