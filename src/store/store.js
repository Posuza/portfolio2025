import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import createUserSlice from './slices/userSlice'
import createProjectsSlice from './slices/projectsSlice'
import createEducationsSlice from './slices/educationsSlice'
import createWorkSlice from './slices/workSlice'
import createReferencesSlice from './slices/referencesSlice'
import createBlogsSlice from './slices/blogsSlice'
import createUsersSlice from './slices/usersSlice'

// initial state (used for clear/reset)
const initialState = {
  items: [],
  selectedProfile: null,
  projects: [],
  educations: [],
  workExperiences: [],
  references: [],
  blogs: [],
  users: [],
}

// root store: combine slices and persist at top level
const usePortfolioStore = create(
  devtools(
    persist(
      (set, get) => ({
        // hydration flag
        _hasHydrated: false,
        setHasHydrated: (v) => set({ _hasHydrated: v }),

        // clear store helper
        clearStore: () => {
          set(initialState)
          try { localStorage.removeItem('portfolio-storage') } catch (_) {}
        },

        // slices
        ...createUserSlice(set, get),
        ...createProjectsSlice(set, get),
        ...createEducationsSlice(set, get),
        ...createWorkSlice(set, get),
        ...createReferencesSlice(set, get),
        ...createBlogsSlice(set, get),
        ...createUsersSlice(set, get),
      }),
      {
        name: 'portfolio-storage',
        partialize: (state) => ({
          items: state.items,
          selectedProfile: state.selectedProfile,
          projects: state.projects,
          educations: state.educations,
          workExperiences: state.workExperiences,
          references: state.references,
          blogs: state.blogs,
          users: state.users,
        }),
        onRehydrateStorage: () => (state) => {
          try {
            usePortfolioStore.getState().setHasHydrated(true)
          } catch (e) {}
        },
      }
    ),
    { name: 'portfolio-store', enabled: process.env.NODE_ENV !== 'production' }
  )
)

export default usePortfolioStore
export { usePortfolioStore }