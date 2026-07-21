import api from './api'

export const adminService = {
  getStats:     async () => (await api.get('/admin/stats')).data,
  getOrders:    async () => (await api.get('/admin/orders')).data,
  getCustomers: async () => (await api.get('/admin/customers')).data,
  getProducts:  async () => (await api.get('/admin/products')).data,

  // Products CRUD
  uploadImage: async (formData) => (await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  createProduct: async (data) => (await api.post('/admin/products', data)).data,
  updateProduct: async (id, data) => (await api.patch(`/admin/products/${id}`, data)).data,
  deleteProduct: async (id) => (await api.delete(`/admin/products/${id}`)).data,

  // Orders

  updateOrderStatus: async (id, status) => { const res = await api.patch(`/admin/orders/${id}/status`, { status }); return res.data },
  deleteOrder: async (id) => { const res = await api.delete(`/admin/orders/${id}`); return res.data },

  // Customers
  createCustomer:     async (data) => (await api.post('/admin/customers', data)).data,
  updateCustomer:     async (id, data) => (await api.patch(`/admin/customers/${id}`, data)).data,
  updateCustomerRole: async (id, role) => (await api.patch(`/admin/customers/${id}/role`, { role })).data,
  deleteCustomer:     async (id) => (await api.delete(`/admin/customers/${id}`)).data,

  // Content Management
  getContent: async (pageName) => (await api.get(`/content/${pageName}`)).data,
  updateContent: async (pageName, data) => (await api.put(`/admin/content/${pageName}`, data)).data,

  // Enquiries
  getEnquiries: async () => (await api.get('/enquiries')).data,
  updateEnquiryStatus: async (id, status) => (await api.put(`/enquiries/${id}`, { status })).data,
  deleteEnquiry: async (id) => (await api.delete(`/enquiries/${id}`)).data,
}
