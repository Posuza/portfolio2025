import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'projects'

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
    console.error('[projectsService] callApi error', action, err)
    throw err
  }
}

export async function listProjects() {
  return callApi('list', 'GET')
}

export async function getProject(id) {
  const res = await listProjects()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createProject(project) {
  return callApi('create', 'POST', project)
}

export async function updateProject(project) {
  return callApi('update', 'POST', project)
}

export async function deleteProject(projectId) {
  return callApi('delete', 'POST', { id: projectId })
}

export async function uploadImage(filename, dataUrl) {
  const res = await callApi('uploadImage', 'POST', { filename, dataUrl })
  if (res && res.url) return { url: res.url, id: res.id || null }
  throw new Error(res && res.error ? String(res.error) : 'uploadImage failed')
}

const projectsService = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
}

export default projectsService