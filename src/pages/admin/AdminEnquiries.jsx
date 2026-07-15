import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import { Search, MailOpen, Mail, Send, ChevronDown, ChevronUp, CheckCircle, Trash2 } from 'lucide-react'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    loadEnquiries()
  }, [])

  const loadEnquiries = async () => {
    try {
      const response = await adminService.getEnquiries()
      if (response.success) {
        setEnquiries(response.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateEnquiryStatus(id, status)
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e))
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This cannot be undone.')) return;
    try {
      await adminService.deleteEnquiry(id)
      setEnquiries(enquiries.filter(e => e.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete enquiry')
    }
  }

  const filteredEnquiries = enquiries.filter(enq => 
    (enq.firstName + ' ' + enq.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enq.enquiryType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleExpand = (id, status) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      if (status === 'UNREAD') {
        handleStatusChange(id, 'READ')
      }
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'UNREAD': return 'text-red-400 bg-red-400/10'
      case 'READ': return 'text-blue-400 bg-blue-400/10'
      case 'RESPONDED': return 'text-emerald-400 bg-emerald-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Contact Enquiries</h2>
          <p className="text-sm text-gray-400 mt-1">Manage customer messages and consultations</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#333333] flex items-center justify-between bg-[#0A0A0A]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search enquiries by name, email or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1A1A1A] text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-[#333333] focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading enquiries...</div>
          ) : filteredEnquiries.length === 0 ? (
             <div className="p-8 text-center text-gray-500">No enquiries found</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F0F0F] text-xs uppercase tracking-wider text-gray-500 border-b border-[#333333]">
                  <th className="p-4 font-semibold">Name / Email</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#151515] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center font-bold text-[#D4AF37]">
                          {enq.firstName[0]}{enq.lastName[0]}
                        </div>
                        <div>
                          <p className={`text-sm ${enq.status === 'UNREAD' ? 'font-bold text-white' : 'font-medium text-gray-200'}`}>
                            {enq.firstName} {enq.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{enq.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-gray-300 bg-[#222] px-2 py-1 rounded">
                        {enq.enquiryType}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select 
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider outline-none cursor-pointer ${getStatusColor(enq.status)}`}
                      >
                        <option value="UNREAD">Unread</option>
                        <option value="READ">Read</option>
                        <option value="RESPONDED">Responded</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button onClick={() => toggleExpand(enq.id, enq.status)} className="p-2 text-gray-400 hover:text-white transition-colors bg-[#222] rounded-lg">
                            {expandedId === enq.id ? <ChevronUp size={16} /> : (enq.status === 'UNREAD' ? <Mail size={16} className="text-[#D4AF37]" /> : <MailOpen size={16} />)}
                         </button>
                         <button onClick={() => handleDelete(enq.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors bg-[#222] rounded-lg" title="Delete Enquiry">
                            <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Expanded Message Modal / View */}
      {expandedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] w-full max-w-2xl rounded-2xl border border-[#333333] shadow-2xl overflow-hidden animate-slide-up">
            {filteredEnquiries.filter(e => e.id === expandedId).map(enq => (
              <div key={enq.id}>
                <div className="p-6 border-b border-[#333333] flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Message from {enq.firstName} {enq.lastName}</h3>
                    <p className="text-sm text-gray-400">{enq.email} • {enq.enquiryType}</p>
                  </div>
                  <button onClick={() => setExpandedId(null)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="p-6 bg-[#0A0A0A]">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {enq.message}
                  </p>
                </div>
                <div className="p-6 border-t border-[#333333] flex justify-between items-center bg-[#111111]">
                  <span className="text-xs text-gray-500">Sent on {new Date(enq.createdAt).toLocaleString()}</span>
                  <div className="flex gap-3">
                    {enq.status !== 'RESPONDED' && (
                      <button 
                        onClick={() => {
                          handleStatusChange(enq.id, 'RESPONDED')
                          setExpandedId(null)
                        }}
                        className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={14} /> Mark as Responded
                      </button>
                    )}
                    <a 
                      href={`mailto:${enq.email}?subject=Reply to your Luxe Precision Enquiry`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#222222] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2"
                    >
                      <Send size={14} /> Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
