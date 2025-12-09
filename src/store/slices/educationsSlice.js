import educationsService from '../../services/educationsService'

const createEducationsSlice = (set, get) => ({
  educations: [],
  setEducations: (items) => set({ educations: items }),
  addEducation: (item) =>
    set((state) => ({ educations: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.educations] })),
  updateEducationLocal: (id, patch) =>
    set((state) => ({ educations: state.educations.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
  removeEducation: (id) => set((state) => ({ educations: state.educations.filter((e) => e.id !== id) })),
  clearEducations: () => set({ educations: [] }),

  fetchEducationsRemote: async () => {
    try {
      const res = await educationsService.listEducations()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ educations: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createEducationRemote: async (payload) => {
    try {
      await educationsService.createEducation(payload)
      await get().fetchEducationsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateEducationRemote: async (payload) => {
    try {
      await educationsService.updateEducation(payload)
      await get().fetchEducationsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteEducationRemote: async (id) => {
    try {
      await educationsService.deleteEducation(id)
      await get().fetchEducationsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createEducationsSlice