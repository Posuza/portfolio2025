import referencesService from '../../services/referencesService'

const createReferencesSlice = (set, get) => ({
  references: [],
  setReferences: (items) => set({ references: items }),
  addReference: (item) =>
    set((state) => ({ references: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.references] })),
  updateReferenceLocal: (id, patch) =>
    set((state) => ({ references: state.references.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
  removeReference: (id) => set((state) => ({ references: state.references.filter((r) => r.id !== id) })),
  clearReferences: () => set({ references: [] }),

  fetchReferencesRemote: async () => {
    try {
      const res = await referencesService.listReferences()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ references: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createReferenceRemote: async (payload) => {
    try {
      await referencesService.createReference(payload)
      await get().fetchReferencesRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateReferenceRemote: async (payload) => {
    try {
      await referencesService.updateReference(payload)
      await get().fetchReferencesRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteReferenceRemote: async (id) => {
    try {
      await referencesService.deleteReference(id)
      await get().fetchReferencesRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createReferencesSlice