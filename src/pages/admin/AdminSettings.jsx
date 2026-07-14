import { useState } from 'react'
import api from '../../services/api'
import { KeyRound, ShieldAlert, CheckCircle, Eye, EyeOff, User, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user, updateProfile } = useAuth() 
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and Username/Email cannot be empty' })
      return
    }
    setProfileLoading(true)
    try {
      const res = await updateProfile({ name: profileName, email: profileEmail })
      if (res.success) {
        setProfileMsg({ type: 'success', text: 'Profile name updated successfully!' })
      } else {
        setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile' })
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Error updating profile' })
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      })

      if (res.data.success) {
        setSuccess('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(res.data.message || 'Failed to update password')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Settings */}
      <div className="bg-[#000000] rounded-3xl p-8 shadow-sm border border-[#333333]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#D4AF37]">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-100">Profile Settings</h2>
            <p className="text-xs text-gray-400">Update your administrator profile name</p>
          </div>
        </div>

        {profileMsg.text && (
          <div className={`mb-6 rounded-2xl p-4 flex items-start gap-3 border ${profileMsg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
            {profileMsg.type === 'success' ? <CheckCircle className="flex-shrink-0 mt-0.5" size={18} /> : <ShieldAlert className="flex-shrink-0 mt-0.5" size={18} />}
            <p className="text-xs font-semibold">{profileMsg.text}</p>
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5 block">
              Admin Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full border border-[#444444] bg-transparent text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5 block">
              Admin Username (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full border border-[#444444] bg-transparent text-white rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="px-6 py-3.5 bg-[#D4AF37] text-white font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-yellow-600 transition-all disabled:opacity-60"
          >
            {profileLoading ? 'Updating...' : 'Update Name'}
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-[#000000] rounded-3xl p-8 shadow-sm border border-[#333333]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#D4AF37]">
          <KeyRound size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-100">Security Settings</h2>
          <p className="text-xs text-gray-400">Update your administrator password here</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <ShieldAlert className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-600 text-xs font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-emerald-600 text-xs font-semibold">{success}</p>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5 block">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-[#444444] rounded-xl pl-4 pr-11 py-3 text-sm
                outline-none focus:border-blue-600 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5 block">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-[#444444] rounded-xl pl-4 pr-11 py-3 text-sm
                outline-none focus:border-blue-600 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5 block">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#444444] rounded-xl pl-4 pr-11 py-3 text-sm
                outline-none focus:border-blue-600 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-[#D4AF37] text-white font-bold text-xs
            tracking-widest uppercase rounded-xl hover:bg-blue-700
            transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
      </div>
    </div>
  )
}
