import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Star, Gift, Crown, ChevronRight, Copy } from 'lucide-react'
import PageTransition from '../components/common/PageTransition'
import SEO from '../components/common/SEO'
import toast from 'react-hot-toast'

export default function MembershipPage() {
  const [copied, setCopied] = useState(false)
  
  // Mock data for user's VIP status
  const userTier = 'Gold'
  const points = 12500
  const pointsToNext = 2500
  const progress = (points / (points + pointsToNext)) * 100

  const handleCopyCode = () => {
    navigator.clipboard.writeText('LUXEVIP500')
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageTransition>
      <SEO title="VIP Membership | Luxe Precision" />
      <div className="min-h-screen bg-[#000000] text-white">
        
        {/* Header Hero */}
        <div className="relative pt-24 pb-16 px-6 overflow-hidden border-b border-[#FFFFFF]/10 bg-gradient-to-b from-[#111111] to-black">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block px-4 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full mb-6">
              The Atelier Experience
            </span>
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Welcome to Your <span className="text-[#D4AF37]">VIP Dashboard</span>
            </h1>
            <p className="text-gray-400 font-sans max-w-2xl mx-auto text-sm leading-relaxed">
              Unlock exclusive collections, priority concierge support, and early access to drops as a valued member of our inner circle.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Status Card */}
            <div className="lg:col-span-2 bg-[#111111] border border-[#333333] rounded-2xl p-8 relative overflow-hidden">
              <Crown size={120} className="absolute -bottom-10 -right-10 text-[#D4AF37] opacity-10" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Current Tier</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-serif text-[#D4AF37]">{userTier} Member</span>
                    <Star size={24} className="text-[#D4AF37] fill-[#D4AF37]" />
                  </div>
                </div>
                
                <div className="text-left md:text-right">
                  <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Atelier Points</h3>
                  <span className="text-3xl font-sans font-light">{points.toLocaleString()} <span className="text-sm text-[#D4AF37]">pts</span></span>
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="bg-[#000000] rounded-xl p-5 border border-[#222222]">
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-3">
                  <span className="text-[#D4AF37]">Gold</span>
                  <span className="text-gray-500">Platinum</span>
                </div>
                <div className="h-2 bg-[#222222] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-200 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 font-sans text-center">
                  Earn <span className="text-white font-bold">{pointsToNext.toLocaleString()} more points</span> to reach Platinum status.
                </p>
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                  <Gift size={24} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-serif mb-3">Invite a Friend, Get ₹500</h3>
                <p className="text-sm text-gray-400 mb-6 font-sans">
                  Share the luxury. When they make their first purchase, you both receive ₹500 off your next order.
                </p>
              </div>

              <div className="mt-auto">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Your Referral Code</p>
                <button 
                  onClick={handleCopyCode}
                  className="w-full flex items-center justify-between bg-[#000000] border border-[#333333] hover:border-[#D4AF37] p-4 rounded-xl transition-colors group"
                >
                  <span className="font-mono text-lg text-white group-hover:text-[#D4AF37] transition-colors">LUXEVIP500</span>
                  <Copy size={18} className={copied ? "text-green-500" : "text-gray-500 group-hover:text-[#D4AF37]"} />
                </button>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif mb-8 text-center">Exclusive Tier Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Bronze */}
              <div className="bg-[#111111] border border-[#333333] rounded-2xl p-6 opacity-70">
                <h3 className="text-[#cd7f32] font-serif text-xl mb-4 flex items-center justify-between">
                  Bronze <Award size={20} />
                </h3>
                <ul className="flex flex-col gap-3 text-sm text-gray-400 font-sans">
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#cd7f32]"/> 1x Points on purchases</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#cd7f32]"/> Birthday Gift</li>
                </ul>
              </div>

              {/* Silver */}
              <div className="bg-[#111111] border border-[#333333] rounded-2xl p-6 opacity-70">
                <h3 className="text-gray-300 font-serif text-xl mb-4 flex items-center justify-between">
                  Silver <Award size={20} />
                </h3>
                <ul className="flex flex-col gap-3 text-sm text-gray-400 font-sans">
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-gray-300"/> 1.5x Points on purchases</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-gray-300"/> Birthday Gift</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-gray-300"/> Early access to sales</li>
                </ul>
              </div>

              {/* Gold (Active) */}
              <div className="bg-[#1a1811] border border-[#D4AF37]/50 rounded-2xl p-6 relative overflow-hidden transform md:-translate-y-2 shadow-2xl shadow-[#D4AF37]/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
                <h3 className="text-[#D4AF37] font-serif text-xl mb-4 flex items-center justify-between relative z-10">
                  Gold <Award size={20} />
                </h3>
                <ul className="flex flex-col gap-3 text-sm text-gray-300 font-sans relative z-10">
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#D4AF37]"/> 2x Points on purchases</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#D4AF37]"/> Premium Birthday Gift</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#D4AF37]"/> VIP early access to drops</li>
                  <li className="flex items-center gap-2"><ChevronRight size={14} className="text-[#D4AF37]"/> Free Express Shipping</li>
                  <li className="flex items-center gap-2 font-bold text-white"><ChevronRight size={14} className="text-[#D4AF37]"/> Priority Concierge Support</li>
                </ul>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </PageTransition>
  )
}
