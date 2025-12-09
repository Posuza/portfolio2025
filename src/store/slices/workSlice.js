import workService from '../../services/workService'

const createWorkSlice = (set, get) => ({
  workExperiences: [],
  setWorkExperiences: (items) => set({ workExperiences: items }),
  addWorkExperience: (item) =>
    set((state) => ({ workExperiences: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.workExperiences] })),
  updateWorkExperienceLocal: (id, patch) =>
    set((state) => ({ workExperiences: state.workExperiences.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
  removeWorkExperience: (id) => set((state) => ({ workExperiences: state.workExperiences.filter((w) => w.id !== id) })),
  clearWorkExperiences: () => set({ workExperiences: [] }),

  fetchWorkRemote: async () => {
    try {
      const res = await workService.listWorkExperiences()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ workExperiences: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createWorkRemote: async (payload) => {
    try {
      await workService.createWorkExperience(payload)
      await get().fetchWorkRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateWorkRemote: async (payload) => {
    try {
      await workService.updateWorkExperience(payload)
      await get().fetchWorkRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteWorkRemote: async (id) => {
    try {
      await workService.deleteWorkExperience(id)
      await get().fetchWorkRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createWorkSlice