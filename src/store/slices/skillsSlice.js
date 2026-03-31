import skillsService from '../../services/skillsService'

const createSkillsSlice = (set, get) => ({
  skills: [],
  setSkills: (items) => set({ skills: items }),
  addSkill: (item) =>
    set((state) => ({ skills: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.skills] })),
  updateSkillLocal: (id, patch) =>
    set((state) => ({ skills: state.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
  removeSkill: (id) => set((state) => ({ skills: state.skills.filter((s) => s.id !== id) })),
  clearSkills: () => set({ skills: [] }),

  fetchSkillsRemote: async () => {
    try {
      const res = await skillsService.listSkills()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ skills: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createSkillRemote: async (payload) => {
    try {
      await skillsService.createSkill(payload)
      await get().fetchSkillsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateSkillRemote: async (payload) => {
    try {
      await skillsService.updateSkill(payload)
      await get().fetchSkillsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteSkillRemote: async (id) => {
    try {
      await skillsService.deleteSkill(id)
      await get().fetchSkillsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createSkillsSlice
