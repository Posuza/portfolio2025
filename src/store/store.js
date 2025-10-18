import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import createUserSlice from './userSlice'

// initial state (used for clear/reset)
const initialState = {
  items: [],
  selectedProfile: null,
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
      }),
      {
        name: 'portfolio-storage',
        partialize: (state) => ({ items: state.items, selectedProfile: state.selectedProfile }),
        onRehydrateStorage: () => (state) => {
          // rehydration complete
          try {
            usePortfolioStore.getState().setHasHydrated(true)
            // optionally log or refresh remote data
            // usePortfolioStore.getState().fetchRemote?.()
          } catch (e) {}
        },
      }
    ),
    { name: 'portfolio-store', enabled: process.env.NODE_ENV !== 'production' }
  )
)

export default usePortfolioStore
export { usePortfolioStore }