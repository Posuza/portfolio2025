import blogsService from '../../services/blogsService'

const createBlogsSlice = (set, get) => ({
  blogs: [],
  setBlogs: (items) => set({ blogs: items }),
  addBlog: (item) =>
    set((state) => ({ blogs: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.blogs] })),
  updateBlogLocal: (id, patch) =>
    set((state) => ({ blogs: state.blogs.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
  removeBlog: (id) => set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) })),
  clearBlogs: () => set({ blogs: [] }),

  fetchBlogsRemote: async () => {
    try {
      const res = await blogsService.listBlogs()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ blogs: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createBlogRemote: async (payload) => {
    try {
      await blogsService.createBlog(payload)
      await get().fetchBlogsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateBlogRemote: async (payload) => {
    try {
      await blogsService.updateBlog(payload)
      await get().fetchBlogsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteBlogRemote: async (id) => {
    try {
      await blogsService.deleteBlog(id)
      await get().fetchBlogsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createBlogsSlice