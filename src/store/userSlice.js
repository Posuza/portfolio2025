import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// switched to the real service
import api from '../services/userService'

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => {
      reader.abort()
      reject(new Error('Failed to read file'))
    }
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })

export const createUserSlice = (set, get) => ({
  items: [],
  selectedProfile: null,

  setItems: (items) => set({ items }),
  setSelectedProfile: (p) => set({ selectedProfile: p }),

  addItem: (item) =>
    set((state) => ({ items: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.items] })),

  updateItem: (id, patch) =>
    set((state) => ({ items: state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),

  removeItem: (id) => set((state) => ({ items: state.items.filter((it) => it.id !== id) })),

  clearAll: () => set({ items: [], selectedProfile: null }),

  fetchRemote: async () => {
    try {
      const res = await api.listItems()
      const data = res.data || []
      set({ items: data.reverse() })
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  fetchProfile: async (id) => {
    try {
      const p = await api.getUser(id)
      set({ selectedProfile: p || null })
      return { success: true, profile: p || null }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createRemote: async (item) => {
    try {
      await api.createItem(item)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('createRemote error', err)
      return { success: false, error: err }
    }
  },

  createRemoteWithImage: async (item, file) => {
    try {
      const payload = { ...item }
      if (file) {
        const dataUrl = await readFileAsDataURL(file)
        const up = await api.uploadImage(file.name, dataUrl)
        if (up && up.url) payload.profileImageUrl = up.url
      }
      await api.createItem(payload)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('createRemoteWithImage error', err)
      return { success: false, error: err }
    }
  },

  updateRemote: async (item) => {
    try {
      await api.updateItem(item)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateRemoteWithImage: async (item, file) => {
    try {
      const payload = { ...item }
      if (file) {
        const dataUrl = await readFileAsDataURL(file)
        const up = await api.uploadImage(file.name, dataUrl)
        if (up && up.url) payload.profileImageUrl = up.url
      }
      await api.updateItem(payload)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('updateRemoteWithImage error', err)
      return { success: false, error: err }
    }
  },

  saveProfile: async (item, file) => {
    if (item?.id) return get().updateRemoteWithImage(item, file)
    return get().createRemoteWithImage(item, file)
  },

  deleteRemote: async (itemOrId) => {
    try {
      const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id
      if (!id) throw new Error('missing id for delete')
      await api.deleteItem(id)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  uploadImageOnly: async (file) => {
    try {
      const dataUrl = await readFileAsDataURL(file)
      const up = await api.uploadImage(file.name, dataUrl)
      return { success: true, url: up.url, id: up.id }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  // aliases
  profiles: () => get().items,
  createProfile: (p) => get().createRemote(p),
  createProfileWithImage: (p, file) => get().createRemoteWithImage(p, file),
  updateProfile: (p) => get().updateRemote(p),
  updateProfileWithImage: (p, file) => get().updateRemoteWithImage(p, file),
  saveProfileWithImage: (p, file) => get().saveProfile(p, file),
  deleteProfile: (id) => get().deleteRemote(id),
})

export default createUserSlice
