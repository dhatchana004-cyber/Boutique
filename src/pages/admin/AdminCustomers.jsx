import { useState } from 'react'
import { 
  UserCircle, Trash2, Pencil, Plus,
  Mail, Phone, Calendar, MapPin, CreditCard, TrendingUp, PackageOpen, X
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Modal, ConfirmDialog, InputField, SelectField, STATUS_COLORS } from './AdminUI'

const EMPTY_CUSTOMER = { name: '', email: '', phone: '', role: 'USER', password: '', address: '', city: '', state: '', pincode: '' }
const ROLES = [{ value: 'USER', label: 'USER' }, { value: 'ADMIN', label: 'ADMIN' }]

function CustomerForm({ initial, onSave, onCancel, saving }) {
  // If editing, extract primary address info
  const primaryAddr = initial?.addresses?.[0] || {}
  const [f, setF] = useState(initial ? { 
    ...initial, 
    password: '', 
    addressId: primaryAddr.id || '',
    address: primaryAddr.address || '', 
    city: primaryAddr.city || '', 
    state: primaryAddr.state || '', 
    pincode: primaryAddr.pincode || '' 
  } : EMPTY_CUSTOMER)

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const isEditing = !!initial

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" value={f.name} onChange={e => set('name', e.target.value)} required />
        <InputField label="Email Address" type="email" value={f.email} onChange={e => set('email', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Phone Number" value={f.phone || ''} onChange={e => set('phone', e.target.value)} />
        <SelectField label="Role" value={f.role} onChange={e => set('role', e.target.value)} options={ROLES} />
      </div>

      {!isEditing && (
        <InputField label="Password" type="password" value={f.password} onChange={e => set('password', e.target.value)} required={!isEditing} />
      )}

      <div className="pt-2 border-t mt-4 mb-2">
        <p className="text-sm font-bold text-gray-100 mb-3">Address Information</p>
        <InputField label="Street Address" value={f.address} onChange={e => set('address', e.target.value)} />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <InputField label="City" value={f.city} onChange={e => set('city', e.target.value)} />
          <InputField label="State" value={f.state} onChange={e => set('state', e.target.value)} />
          <InputField label="Pincode" value={f.pincode} onChange={e => set('pincode', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-gray-500 hover:bg-[#1A1A1A] rounded-xl">Cancel</button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm bg-[#D4AF37] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold">
          {saving ? 'Saving...' : 'Save Customer'}
        </button>
      </div>
    </form>
  )
}

export default function AdminCustomers({ customers, orders = [], onRefresh }) {
  const getAvatarUrl = (url) => {
    if (!url || url === 'null' || url.trim() === '') return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://boutique-backend-7con.onrender.com';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  const [confirm, setConfirm] = useState(null) // id to delete
  const [modal, setModal] = useState(null) // 'add' | customer obj for edit
  const [saving, setSaving] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)



  const handleDelete = async () => {
    try {
      await adminService.deleteCustomer(confirm)
      setConfirm(null)
      onRefresh()
    } catch (e) { console.error(e) }
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal === 'add') {
        await adminService.createCustomer(data)
      } else {
        await adminService.updateCustomer(modal.id, data)
      }
      setModal(null)
      onRefresh()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="bg-[#000000] rounded-2xl shadow-sm border border-[#333333] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#333333] flex items-center justify-between">
          <h3 className="font-bold text-gray-100">All Customers ({customers.length})</h3>
          <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-white text-xs font-bold rounded-xl hover:bg-blue-700">
            <Plus size={16} /> Add Customer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#111111] text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Email & Phone</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Primary Address</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => {
                const primaryAddr = c.addresses?.[0]
                return (
                  <tr key={c.id} className="hover:bg-[#111111]/50">
                    <td className="px-6 py-4 flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedCustomer(c)}>
                      {c.avatar ? (
                        <img src={getAvatarUrl(c.avatar)} className="w-8 h-8 rounded-full object-cover border border-[#333333] ring-2 ring-transparent group-hover:ring-blue-500 transition-all" />
                      ) : (
                        <UserCircle size={32} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                      )}
                      <span className="font-semibold text-gray-100 group-hover:text-[#D4AF37] transition-colors">{c.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-100">{c.email}</p>
                      <p className="text-xs text-gray-400">{c.phone || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {primaryAddr ? (
                        <>
                          <p className="text-gray-100 capitalize">{primaryAddr.city}, {primaryAddr.state}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{primaryAddr.address}</p>
                        </>
                      ) : <span className="text-gray-400 italic">No Address</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${c.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-[#1A1A1A] text-gray-400'}`}>
                        {c.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(c)} title="Edit Customer" className="p-2 hover:bg-blue-50 rounded-lg text-[#D4AF37]">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setConfirm(c.id)} title="Delete User" className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Customer' : 'Edit Customer'} onClose={() => setModal(null)}>
          <CustomerForm initial={modal === 'add' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}

      {confirm && <ConfirmDialog message="Are you sure you want to delete this customer? All their orders and data will be lost." onConfirm={handleDelete} onCancel={() => setConfirm(null)} />}

      {/* Customer Details Modal */}
      {selectedCustomer && (() => {
        const c = selectedCustomer
        const customerOrders = orders.filter(o => o.user?.email === c.email || o.userId === c.id)
        const totalSpent = customerOrders
          .filter(o => o.paymentStatus === 'PAID')
          .reduce((sum, o) => sum + (o.total || 0), 0)
        const totalOrdersCount = customerOrders.length
        const paidOrders = customerOrders.filter(o => o.paymentStatus === 'PAID')
        const avgOrderValue = paidOrders.length > 0 ? (totalSpent / paidOrders.length) : 0

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-[#000000] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]">
                <h3 className="font-black text-gray-950 tracking-tight">Customer Profile</h3>
                <button onClick={() => setSelectedCustomer(null)} className="p-1.5 hover:bg-[#1A1A1A] rounded-lg text-gray-400 hover:text-gray-650 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                
                {/* Left Side: Profile Summary & Stats */}
                <div className="p-6 flex flex-col items-center text-center space-y-6 bg-[#111111]/50">
                  <div className="relative">
                    {c.avatar ? (
                      <img src={getAvatarUrl(c.avatar)} className="w-24 h-24 rounded-2xl object-cover shadow-md border border-[#333333]" alt={c.name} />
                    ) : (
                      <UserCircle size={96} className="text-gray-300 bg-[#000000] rounded-full shadow-sm" />
                    )}
                    <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-sm border ${
                      c.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
                      {c.role || 'USER'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-black text-gray-100 text-lg leading-tight">{c.name}</h4>
                    <p className="text-xs text-gray-450 font-semibold tracking-wider uppercase">Joined {new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="w-full text-left space-y-3 pt-4 border-t border-gray-250/60">
                    <div className="flex items-center gap-2.5 text-gray-400">
                      <Mail size={16} className="text-gray-450 flex-shrink-0" />
                      <span className="text-xs truncate font-medium">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-400">
                      <Phone size={16} className="text-gray-450 flex-shrink-0" />
                      <span className="text-xs font-medium">{c.phone || 'No phone number'}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-gray-250/60">
                    <div className="bg-[#000000] rounded-2xl p-3 border border-[#333333] shadow-sm text-left">
                      <div className="text-gray-400 mb-1">
                        <CreditCard size={14} className="text-blue-500" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Spent</p>
                      <p className="text-sm font-black text-gray-100 mt-0.5">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#000000] rounded-2xl p-3 border border-[#333333] shadow-sm text-left">
                      <div className="text-gray-450 mb-1">
                        <TrendingUp size={14} className="text-emerald-500" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Order</p>
                      <p className="text-sm font-black text-gray-100 mt-0.5">₹{Math.round(avgOrderValue).toLocaleString()}</p>
                    </div>
                    <div className="bg-[#000000] rounded-2xl p-3 border border-[#333333] shadow-sm text-left col-span-2 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
                        <p className="text-base font-black text-gray-100 mt-0.5">{totalOrdersCount}</p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center text-gray-405">
                        <Calendar size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Address & Order History */}
                <div className="p-6 md:col-span-2 space-y-6">
                  
                  {/* Saved Addresses */}
                  <div>
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Saved Addresses</h4>
                    {c.addresses && c.addresses.length > 0 ? (
                      <div className="space-y-3">
                        {c.addresses.map((addr) => (
                          <div key={addr.id} className="border border-[#333333] rounded-2xl p-4 bg-[#111111]/50">
                            <div className="flex items-center gap-2 text-[10px] text-gray-450 font-bold mb-1 uppercase tracking-wider">
                              <MapPin size={12} className="text-blue-500" />
                              <span>{addr.isDefault ? 'Primary Address' : 'Address'}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-100">{addr.name || c.name}</p>
                            <p className="text-xs text-gray-650 mt-1">{addr.address}</p>
                            <p className="text-xs text-gray-650">{addr.city}, {addr.state} - {addr.pincode}</p>
                            {addr.phone && <p className="text-[10px] text-gray-400 mt-1">Tel: {addr.phone}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-[#444444] rounded-2xl bg-[#111111]/30">
                        <MapPin size={20} className="text-gray-300 mx-auto mb-1.5" />
                        <p className="text-xs text-gray-400 italic">No addresses saved yet</p>
                      </div>
                    )}
                  </div>

                  {/* Order History */}
                  <div>
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Order History ({totalOrdersCount})</h4>
                    {customerOrders && customerOrders.length > 0 ? (
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {customerOrders.map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-3 border border-[#333333] rounded-xl hover:bg-[#111111]/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#D4AF37] font-mono text-xs font-bold border border-blue-100/50">
                                #{o.id}
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${STATUS_COLORS[o.status] || 'bg-[#1A1A1A] text-gray-500'}`}>
                                  {o.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-gray-100">₹{o.total?.toLocaleString()}</p>
                              <span className={`inline-block text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md mt-0.5 ${STATUS_COLORS[o.paymentStatus] || 'bg-[#1A1A1A] text-gray-500'}`}>
                                {o.paymentStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-[#444444] rounded-2xl bg-[#111111]/30">
                        <PackageOpen size={20} className="text-gray-300 mx-auto mb-1.5" />
                        <p className="text-xs text-gray-400 italic">No orders placed yet</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
