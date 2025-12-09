// This slice is deprecated - use userSlice.js instead
// Kept for backwards compatibility

import userService from '../../services/userService'

const createUsersSlice = (set, get) => ({
  // This is an alias that points to the users array from userSlice
  // No separate state needed - userSlice manages users array
  
  fetchUsersRemote: async () => {
    try {
      const res = await userService.listUsers()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ users: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createUserRemote: async (payload) => {
    try {
      await userService.createUser(payload)
      await get().fetchUsersRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateUserRemote: async (payload) => {
    try {
      await userService.updateUser(payload)
      await get().fetchUsersRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteUserRemote: async (id) => {
    try {
      await userService.deleteUser(id)
      await get().fetchUsersRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createUsersSlice