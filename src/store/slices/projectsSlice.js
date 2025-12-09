import projectsService from '../../services/projectsService'

const createProjectsSlice = (set, get) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [{ ...project, id: project.id ?? Date.now().toString() }, ...state.projects] })),
  updateProjectLocal: (id, patch) =>
    set((state) => ({ projects: state.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
  removeProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
  clearProjects: () => set({ projects: [] }),

  fetchProjectsRemote: async () => {
    try {
      const res = await projectsService.listProjects()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ projects: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createProjectRemote: async (payload) => {
    try {
      await projectsService.createProject(payload)
      await get().fetchProjectsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateProjectRemote: async (payload) => {
    try {
      await projectsService.updateProject(payload)
      await get().fetchProjectsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteProjectRemote: async (id) => {
    try {
      await projectsService.deleteProject(id)
      await get().fetchProjectsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createProjectsSlice