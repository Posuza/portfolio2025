import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'contacts'

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
    console.error('[contactsService] callApi error', action, err)
    throw err
  }
}

export async function listContacts() {
  return callApi('list', 'GET')
}

export async function getContact(id) {
  const res = await listContacts()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createContact(contact) {
  return callApi('create', 'POST', contact)
}

export async function updateContact(contact) {
  return callApi('update', 'POST', contact)
}

export async function deleteContact(contactId) {
  return callApi('delete', 'POST', { id: contactId })
}

const contactsService = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
}

export default contactsService
