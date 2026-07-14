import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Lock, User, KeyRound, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form.email, form.password)
      if (res.user.role !== 'ADMIN') {
        throw new Error('Access Denied. You are not an Admin.')
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid credentials for Admin access.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-mono">
      
      {/* Dynamic Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 200, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 200, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />

      {/* Cybernetic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#00FFC8]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Terminal Window Header */}
        <div className="bg-[#111] rounded-t-lg border border-white/10 border-b-0 px-4 py-2 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[10px] text-white/40 tracking-widest uppercase">Admin Terminal</span>
        </div>

        {/* Form Container */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-b-lg p-8 shadow-[0_0_50px_rgba(0,255,200,0.05)] backdrop-blur-md">
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00FFC8] blur-xl opacity-20 animate-pulse" />
              <div className="w-16 h-16 bg-[#111] border border-[#00FFC8]/30 rounded-2xl flex items-center justify-center relative z-10">
                <Shield className="text-[#00FFC8]" size={32} />
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl text-white font-bold tracking-tight mb-2">System Access</h1>
            <p className="text-[#00FFC8]/70 text-xs tracking-widest uppercase">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Admin Email */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 group-focus-within:text-[#00FFC8] transition-colors">
                Admin Identifier
              </label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00FFC8] transition-colors">
                  <User size={18} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@luxe.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 pl-8 pb-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#00FFC8] transition-all"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div className="flex flex-col gap-2 group mt-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-white/50 group-focus-within:text-[#00FFC8] transition-colors">
                Security Key
              </label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00FFC8] transition-colors">
                  <KeyRound size={18} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 pl-8 pb-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#00FFC8] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border-l-2 border-red-500 p-3 mt-2">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-[#00FFC8]/10 border border-[#00FFC8]/50 text-[#00FFC8] font-bold text-xs tracking-widest uppercase rounded flex items-center justify-center gap-3 hover:bg-[#00FFC8] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? 'Authenticating...' : 'Initiate Login'}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

        </div>
        
        {/* Footer info */}
        <div className="text-center mt-6 text-[10px] text-white/30 tracking-widest">
          IP LOGGED • SECURE CONNECTION ESTABLISHED
        </div>
      </motion.div>
    </div>
  )
}
