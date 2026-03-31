import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'skills'

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
      return JSON.parse(text)
    } catch (e) {
      throw new Error(`Non-JSON response from API: ${text}`)
    }
  } catch (err) {
    console.error('[skillsService] callApi error', action, err)
    throw err
  }
}

export async function listSkills() {
  return callApi('list', 'GET')
}

export async function getSkill(id) {
  const res = await listSkills()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createSkill(skill) {
  return callApi('create', 'POST', skill)
}

export async function updateSkill(skill) {
  return callApi('update', 'POST', skill)
}

export async function deleteSkill(skillId) {
  return callApi('delete', 'POST', { id: skillId })
}

const skillsService = {
  listSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
}

export default skillsService
