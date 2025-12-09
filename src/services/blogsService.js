import { buildUrl } from '../api/googleAppsApi'

const SHEET_NAME = 'blogs'

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
    console.error('[blogsService] callApi error', action, err)
    throw err
  }
}

export async function listBlogs() {
  return callApi('list', 'GET')
}

export async function getBlog(id) {
  const res = await listBlogs()
  const data = (res && res.data) || []
  return data.find((r) => String(r.id) === String(id)) || null
}

export async function createBlog(blog) {
  return callApi('create', 'POST', blog)
}

export async function updateBlog(blog) {
  return callApi('update', 'POST', blog)
}

export async function deleteBlog(blogId) {
  return callApi('delete', 'POST', { id: blogId })
}

export async function uploadImage(filename, dataUrl) {
  const res = await callApi('uploadImage', 'POST', { filename, dataUrl })
  if (res && res.url) return { url: res.url, id: res.id || null }
  throw new Error(res && res.error ? String(res.error) : 'uploadImage failed')
}

const blogsService = {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
}

export default blogsService