import type { Contact, ContactInput, PaginatedContacts } from '~/types/contact'

export const useContacts = () => {
  const { authFetch } = useAuth()

  const contacts = useState<Contact[]>('contacts_list', () => [])
  const totalContacts = useState<number>('contacts_total', () => 0)
  const currentPage = useState<number>('contacts_page', () => 1)
  const totalPages = useState<number>('contacts_total_pages', () => 1)
  const pageSize = useState<number>('contacts_page_size', () => 12)
  const searchQuery = useState<string>('contacts_search_query', () => '')
  const selectedCategory = useState<string>('contacts_category', () => 'All')
  const filterFavorite = useState<boolean | null>('contacts_favorite_filter', () => null)
  const isLoading = useState<boolean>('contacts_loading', () => false)
  const contactError = useState<string | null>('contacts_error', () => null)

  const fetchContacts = async (page = currentPage.value) => {
    isLoading.value = true
    contactError.value = null
    try {
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', pageSize.value.toString())

      if (searchQuery.value.trim()) {
        queryParams.set('q', searchQuery.value.trim())
      }
      if (selectedCategory.value && selectedCategory.value !== 'All') {
        queryParams.set('category', selectedCategory.value)
      }
      if (filterFavorite.value !== null) {
        queryParams.set('favorite', filterFavorite.value.toString())
      }

      const res = await authFetch<PaginatedContacts>(`/api/contacts?${queryParams.toString()}`)
      contacts.value = res.contacts || []
      totalContacts.value = res.total || 0
      currentPage.value = res.page || 1
      totalPages.value = res.totalPages || 1
    } catch (err: any) {
      contactError.value = err?.data?.error || 'Failed to fetch contacts'
    } finally {
      isLoading.value = false
    }
  }

  const getContactById = async (contactId: string): Promise<Contact | null> => {
    try {
      return await authFetch<Contact>(`/api/contacts/${contactId}`)
    } catch (err: any) {
      contactError.value = err?.data?.error || 'Contact not found'
      return null
    }
  }

  const createContact = async (input: ContactInput): Promise<Contact> => {
    contactError.value = null
    try {
      const newContact = await authFetch<Contact>('/api/contacts', {
        method: 'POST',
        body: input,
      })
      await fetchContacts(1)
      return newContact
    } catch (err: any) {
      contactError.value = err?.data?.error || 'Failed to create contact'
      throw err
    }
  }

  const updateContact = async (contactId: string, input: Partial<ContactInput>): Promise<Contact> => {
    contactError.value = null
    try {
      const updated = await authFetch<Contact>(`/api/contacts/${contactId}`, {
        method: 'PUT',
        body: input,
      })
      // Update local array item
      const idx = contacts.value.findIndex((c) => c.contactId === contactId)
      if (idx !== -1) {
        contacts.value[idx] = { ...contacts.value[idx], ...updated }
      }
      return updated
    } catch (err: any) {
      contactError.value = err?.data?.error || 'Failed to update contact'
      throw err
    }
  }

  const toggleFavorite = async (contact: Contact) => {
    return await updateContact(contact.contactId, {
      favorite: !contact.favorite,
    })
  }

  const deleteContact = async (contactId: string) => {
    contactError.value = null
    try {
      await authFetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      })
      await fetchContacts(currentPage.value)
    } catch (err: any) {
      contactError.value = err?.data?.error || 'Failed to delete contact'
      throw err
    }
  }

  return {
    contacts,
    totalContacts,
    currentPage,
    totalPages,
    pageSize,
    searchQuery,
    selectedCategory,
    filterFavorite,
    isLoading,
    contactError,
    fetchContacts,
    getContactById,
    createContact,
    updateContact,
    toggleFavorite,
    deleteContact,
  }
}
