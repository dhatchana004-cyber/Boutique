import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Menu, 
  LayoutDashboard, 
  ClipboardList, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  LogOut,
  FileText,
  Mail
} from 'lucide-react'

import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminCustomers from './admin/AdminCustomers'
import AdminSettings from './admin/AdminSettings'
import AdminSiteContent from './admin/AdminSiteContent'
import AdminEnquiries from './admin/AdminEnquiries'

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { key: 'orders',     label: 'Orders',     icon: ClipboardList },
  { key: 'customers',  label: 'Customers',  icon: Users },
  { key: 'products',   label: 'Products',   icon: Package },
  { key: 'content',    label: 'Pages Content', icon: FileText },
  { key: 'enquiries',  label: 'Enquiries',  icon: Mail },
  { key: 'settings',   label: 'Settings',   icon: Settings },
]

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#000000] rounded-2xl p-6 shadow-sm border border-[#333333] flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase">{label}</p>
        <p className="text-2xl font-black text-gray-100 mt-1">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true'
  })
  
  const { logout } = useAuth()
  
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev
      localStorage.setItem('admin_sidebar_collapsed', String(next))
      return next
    })
  }

  const loadData = async () => {
    try {
      const [s, o, c, p] = await Promise.all([
        adminService.getStats(),
        adminService.getOrders(),
        adminService.getCustomers(),
        adminService.getProducts(),
      ])
      if (s.success) setStats(s.data)
      if (o.success) setOrders(o.data)
      if (c.success) setCustomers(c.data)
      if (p.success) setProducts(p.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true)
      await loadData()
      setLoading(false)
    }
    initLoad()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statCards = [
    { icon: DollarSign, label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'bg-[#D4AF37]' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-emerald-500' },
    { icon: Users, label: 'Total Customers', value: stats?.totalCustomers || 0, color: 'bg-violet-500' },
    { icon: Package, label: 'Active Products', value: stats?.activeProducts || 0, color: 'bg-amber-500' },
  ]

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#111111] flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#0f1117] text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-auto flex flex-col justify-between h-full flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarCollapsed ? 'w-64 lg:w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className={`flex items-center px-6 py-6 border-b border-white/10 transition-all duration-300 ${
            sidebarCollapsed ? 'lg:px-4 lg:justify-center' : 'justify-between'
          }`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-xs font-black flex-shrink-0">LP</div>
              <span className={`font-black tracking-wider text-sm transition-all duration-300 whitespace-nowrap ${
                sidebarCollapsed ? 'lg:opacity-0 lg:max-w-0 lg:overflow-hidden lg:ml-0' : 'opacity-100 max-w-xs'
              }`}>
                LUXE PRECISION
              </span>
            </div>
            <button 
              className="hidden lg:flex p-1.5 hover:bg-[#000000]/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              onClick={toggleSidebarCollapse}
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {NAV.map(n => (
              <button 
                key={n.key} 
                onClick={() => { setPage(n.key); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  page === n.key ? 'bg-[#D4AF37] text-white' : 'text-gray-400 hover:text-white hover:bg-[#000000]/5'
                } ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                title={sidebarCollapsed ? n.label : undefined}
              >
                <n.icon size={18} className="flex-shrink-0" />
                <span className={`transition-all duration-300 whitespace-nowrap ${
                  sidebarCollapsed ? 'lg:opacity-0 lg:max-w-0 lg:overflow-hidden lg:ml-0' : 'opacity-100 max-w-xs'
                }`}>
                  {n.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          {/* Logout Button */}
          <button 
            onClick={() => {
              logout()
              window.location.href = '/login'
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${
              sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${
              sidebarCollapsed ? 'lg:opacity-0 lg:max-w-0 lg:overflow-hidden lg:ml-0' : 'opacity-100 max-w-xs'
            }`}>
              Sign Out
            </span>
          </button>


        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="bg-[#000000] border-b border-[#333333] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-[#1A1A1A] rounded-xl" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            <h1 className="text-xl font-black text-gray-100 capitalize">{page}</h1>
          </div>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-6 lg:p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Dashboard View */}
          {page === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => <StatCard key={i} {...s} />)}
              </div>
              <AdminOrders orders={orders.slice(0, 10)} onRefresh={loadData} />
            </>
          )}

          {/* Orders View */}
          {page === 'orders' && <AdminOrders orders={orders} onRefresh={loadData} />}

          {/* Customers View */}
          {page === 'customers' && <AdminCustomers customers={customers} orders={orders} onRefresh={loadData} />}

          {/* Products View */}
          {page === 'products' && <AdminProducts products={products} onRefresh={loadData} />}

          {/* Content View */}
          {page === 'content' && <AdminSiteContent />}
          
          {/* Enquiries View */}
          {page === 'enquiries' && <AdminEnquiries />}

          {/* Settings View */}
          {page === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  )
}
