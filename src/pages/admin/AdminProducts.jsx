import { useState, useRef } from 'react'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Modal, ConfirmDialog, InputField, SelectField } from './AdminUI'

const EMPTY = { name:'', brand:'', category:'Sarees', price:'', description:'', image:'', stockQuantity:'', isNew:false }
const CATS = ['Sarees','Jewellery','Lehengas','Accessories','Return Gifts'].map(c=>({value:c,label:c}))

function ProductForm({ initial, onSave, onCancel, saving }) {
  const [f, setF] = useState(initial || EMPTY)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  
  const set = (k,v) => setF(p=>({...p,[k]:v}))

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      set('image', reader.result)
      setUploading(false)
    }
    reader.onerror = () => {
      alert("Failed to read image file")
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }
  return (
    <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="space-y-4">
      <InputField label="Name" value={f.name} onChange={e=>set('name',e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Brand" value={f.brand} onChange={e=>set('brand',e.target.value)} required />
        <SelectField label="Category" value={f.category} onChange={e=>set('category',e.target.value)} options={CATS} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Price (₹)" type="number" value={f.price} onChange={e=>set('price',e.target.value)} required />
        <InputField label="Stock Qty" type="number" value={f.stockQuantity} onChange={e=>set('stockQuantity',e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Image</label>
        <div className="flex items-center gap-4">
          {f.image && (
            <div className="flex flex-col items-center gap-1">
              <img src={f.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#333333] bg-[#1A1A1A]" />
              <button type="button" onClick={() => set('image', '')} className="text-[10px] text-red-500 hover:text-red-400 font-bold tracking-widest uppercase">Remove</button>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2.5 bg-[#1A1A1A] border border-[#444444] rounded-xl text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm flex-1 justify-center font-bold">
            <Upload size={16} /> {uploading ? 'Uploading...' : (f.image ? 'Change Image' : 'Upload Image')}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
        <textarea value={f.description} onChange={e=>set('description',e.target.value)} rows={3}
          className="w-full border border-[#444444] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={f.isNew} onChange={e=>set('isNew',e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-400">Mark as New Arrival</span>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-gray-500 hover:bg-[#1A1A1A] rounded-xl">Cancel</button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm bg-[#D4AF37] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold">
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}

export default function AdminProducts({ products, onRefresh }) {
  const [modal, setModal] = useState(null) // 'add' | product obj for edit
  const [confirm, setConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal === 'add') await adminService.createProduct(data)
      else await adminService.updateProduct(modal.id, data)
      setModal(null)
      onRefresh()
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await adminService.deleteProduct(confirm); setConfirm(null); onRefresh() }
    catch(e) { console.error(e) }
  }

  return (
    <>
      <div className="bg-[#000000] rounded-2xl shadow-sm border border-[#333333] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#333333] flex items-center justify-between">
          <h3 className="font-bold text-gray-100">All Products ({products.length})</h3>
          <button onClick={()=>setModal('add')} className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-white text-xs font-bold rounded-xl hover:bg-blue-700">
            <Plus size={16} /> Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#111111] text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p=>(
                <tr key={p.id} className="hover:bg-[#111111]/50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#1A1A1A]" />
                    <div><p className="font-semibold text-gray-100">{p.name}</p><p className="text-xs text-gray-400">{p.brand}</p></div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{p.category}</td>
                  <td className="px-6 py-4 font-bold">₹{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-400">{p.stockQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.inStock?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>
                      {p.inStock?'In Stock':'Out'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={()=>setModal(p)} className="p-2 hover:bg-blue-50 rounded-lg text-[#D4AF37]"><Pencil size={15}/></button>
                      <button onClick={()=>setConfirm(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal==='add'?'Add Product':'Edit Product'} onClose={()=>setModal(null)}>
          <ProductForm initial={modal==='add'?null:modal} onSave={handleSave} onCancel={()=>setModal(null)} saving={saving}/>
        </Modal>
      )}
      {confirm && <ConfirmDialog message="Are you sure you want to delete this product? This action cannot be undone." onConfirm={handleDelete} onCancel={()=>setConfirm(null)} />}
    </>
  )
}
