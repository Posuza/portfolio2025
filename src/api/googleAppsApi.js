// Replace inline fetch with a simple config + helpers.
// Apps Script spreadsheet/drive IDs are handled server-side (Code.gs).

export let BASE_URL = process.env.REACT_APP_APPS_SCRIPT_URL || ''

export function setBaseUrl(url) {
  BASE_URL = url || BASE_URL
}

export function buildUrl(action) {
  if (!BASE_URL) throw new Error('BASE_URL not configured')
  const u = new URL(BASE_URL)
  u.searchParams.set('action', action)
  return u.toString()
}

export async function callApi(action, method = 'GET', body) {
  const url = buildUrl(action)
  const opts =
    method === 'GET'
      ? { method: 'GET' }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

// named object assigned before default export to satisfy ESLint import/no-anonymous-default-export
const googleAppsApi = {
  setBaseUrl,
  buildUrl,
  callApi,
  get config() {
    return { BASE_URL }
  },
}

export default googleAppsApi