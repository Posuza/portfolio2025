import contactsService from '../../services/contactsService'

const createContactsSlice = (set, get) => ({
  contacts: [],
  setContacts: (items) => set({ contacts: items }),
  addContact: (item) =>
    set((state) => ({ contacts: [{ ...item, id: item.id ?? Date.now().toString() }, ...state.contacts] })),
  updateContactLocal: (id, patch) =>
    set((state) => ({ contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  removeContact: (id) => set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
  clearContacts: () => set({ contacts: [] }),

  fetchContactsRemote: async () => {
    try {
      const res = await contactsService.listContacts()
      const data = Array.isArray(res) ? res : (res && res.data) || []
      set({ contacts: data.reverse() })
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  createContactRemote: async (payload) => {
    try {
      await contactsService.createContact(payload)
      await get().fetchContactsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  updateContactRemote: async (payload) => {
    try {
      await contactsService.updateContact(payload)
      await get().fetchContactsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  deleteContactRemote: async (id) => {
    try {
      await contactsService.deleteContact(id)
      await get().fetchContactsRemote()
      return { success: true }
    } catch (err) {
      return { success: false, error: err }
    }
  },
})

export default createContactsSlice
