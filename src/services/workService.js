

import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'workExperiences'

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
    console.error('[workService] callApi error', action, err)
    throw err
  }
}

export async function listWorkExperiences() {
  return callApi('list', 'GET')
}

export async function getWorkExperience(id) {
  const res = await listWorkExperiences()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createWorkExperience(workExperience) {
  return callApi('create', 'POST', workExperience)
}

export async function updateWorkExperience(workExperience) {
  return callApi('update', 'POST', workExperience)
}

export async function deleteWorkExperience(workExperienceId) {
  return callApi('delete', 'POST', { id: workExperienceId })
}

export async function uploadImage(filename, dataUrl) {
  const res = await callApi('uploadImage', 'POST', { filename, dataUrl })
  if (res && res.url) return { url: res.url, id: res.id || null }
  throw new Error(res && res.error ? String(res.error) : 'uploadImage failed')
}

const workService = {
  listWorkExperiences,
  getWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  uploadImage,
}

export default workService