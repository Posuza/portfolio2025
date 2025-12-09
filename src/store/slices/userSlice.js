import userService from '../../services/userService'

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
  users: [],
  selectedProfile: null,

  setUsers: (users) => set({ users }),
  setSelectedProfile: (p) => set({ selectedProfile: p }),

  addUser: (user) =>
    set((state) => ({ users: [{ ...user, id: user.id ?? Date.now().toString() }, ...state.users] })),

  updateUserLocal: (id, patch) =>
    set((state) => ({ users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),

  removeUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),

  clearUsers: () => set({ users: [], selectedProfile: null }),

  fetchRemote: async () => {
    try {
      const res = await userService.listUsers()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ users: data.reverse() })
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  fetchProfile: async (id) => {
    try {
      const p = await userService.getUser(id)
      set({ selectedProfile: p || null })
      return { success: true, profile: p || null }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createRemote: async (user) => {
    try {
      await userService.createUser(user)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('createRemote error', err)
      return { success: false, error: err }
    }
  },

  createRemoteWithImage: async (user, file) => {
    try {
      const payload = { ...user }
      if (file) {
        const dataUrl = await readFileAsDataURL(file)
        const up = await userService.uploadImage(file.name, dataUrl)
        if (up && up.url) payload.profileImageUrl = up.url
      }
      await userService.createUser(payload)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('createRemoteWithImage error', err)
      return { success: false, error: err }
    }
  },

  updateRemote: async (user) => {
    try {
      await userService.updateUser(user)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateRemoteWithImage: async (user, file) => {
    try {
      const payload = { ...user }
      if (file) {
        const dataUrl = await readFileAsDataURL(file)
        const up = await userService.uploadImage(file.name, dataUrl)
        if (up && up.url) payload.profileImageUrl = up.url
      }
      await userService.updateUser(payload)
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('updateRemoteWithImage error', err)
      return { success: false, error: err }
    }
  },

  saveProfile: async (user, file) => {
    if (user?.id) return get().updateRemoteWithImage(user, file)
    return get().createRemoteWithImage(user, file)
  },

  deleteRemote: async (userOrId) => {
    try {
      console.log('userSlice deleteRemote called with:', userOrId);
      console.log('typeof userOrId:', typeof userOrId);
      
      // Try multiple ways to extract the ID
      let id = null;
      if (typeof userOrId === 'string' || typeof userOrId === 'number') {
        id = String(userOrId);
      } else if (userOrId && typeof userOrId === 'object') {
        // Try different property names (case-insensitive)
        id = userOrId.id || userOrId.ID || userOrId.Id || 
             userOrId._id || userOrId.ID || null;
      }
      
      console.log('extracted id:', id);
      console.log('Full user object:', JSON.stringify(userOrId));
      
      if (!id) {
        console.error('No ID found! userOrId was:', userOrId);
        console.error('Available keys:', userOrId ? Object.keys(userOrId) : 'none');
        throw new Error('missing id for delete - user object: ' + JSON.stringify(userOrId))
      }
      
      console.log('Calling userService.deleteUser with id:', id);
      await userService.deleteUser(String(id))
      await get().fetchRemote()
      return { success: true }
    } catch (err) {
      console.error('deleteRemote error:', err);
      return { success: false, error: err }
    }
  },

  uploadImageOnly: async (file) => {
    try {
      const dataUrl = await readFileAsDataURL(file)
      const up = await userService.uploadImage(file.name, dataUrl)
      return { success: true, url: up.url, id: up.id }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  // aliases
  profiles: () => get().users,
  createProfile: (p) => get().createRemote(p),
  createProfileWithImage: (p, file) => get().createRemoteWithImage(p, file),
  updateProfile: (p) => get().updateRemote(p),
  updateProfileWithImage: (p, file) => get().updateRemoteWithImage(p, file),
  saveProfileWithImage: (p, file) => get().saveProfile(p, file),
  deleteProfile: (id) => get().deleteRemote(id),
})

export default createUserSlice
