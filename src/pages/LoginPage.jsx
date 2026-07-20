import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import PageTransition from '../components/common/PageTransition'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('signin') // 'signin' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'signin') {
        const res = await login(form.email, form.password)
        if (res.user.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await register(form.name, form.email, form.phone, form.password)
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="login-container">
        <style>{`
          .login-container {
            --gold: #c9a24b;
            --gold-light: #e8caa0;
            --cream: #efe6d3;
            --muted: #948e80;
            --input-bg: rgba(255,255,255,0.05);
            --panel: #100f0e;
            min-height: 100vh;
            background: #0b0b0d;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            color: var(--cream);
            padding: 0;
            width: 100%;
          }
          .scene-wrapper{ width:100%; max-width:1024px; }
          .scene{ position:relative; width:100%; aspect-ratio: 1024 / 633; container-type: inline-size; overflow:hidden; }
          .scene > img.bg { display:block; width:100%; height:100%; object-fit:fill; }
          
          .card{
            position:absolute;
            left:47.461%;
            top:14.218%;
            width:44.824%;
            height:75.039%;
            background:var(--panel);
            border:1px solid rgba(201,162,75,0.35);
            border-radius:0.977cqw;
            padding:3.223cqw 3.125cqw 0;
            box-shadow:0 1.953cqw 4.883cqw rgba(0,0,0,0.5);
            display:flex;
            flex-direction:column;
            overflow-y: auto;
            overflow-x: hidden;
            overscroll-behavior: contain;
            scrollbar-width: thin;
            scrollbar-color: rgba(201,162,75,0.5) transparent;
          }
          .card::-webkit-scrollbar { width: 8px; }
          .card::-webkit-scrollbar-track { background: transparent; margin: 8px 0; }
          .card::-webkit-scrollbar-thumb { background: rgba(201,162,75,0.5); border-radius: 8px; border: 2px solid var(--panel); }
          .card::-webkit-scrollbar-thumb:hover { background: rgba(201,162,75,0.8); }

          .tabs{ display:flex; gap:0.781cqw; background:rgba(0,0,0,0.28); border:1px solid rgba(255,255,255,0.07); border-radius:0.781cqw; padding:0.488cqw; margin-bottom:2.148cqw; flex-shrink: 0; }
          .tabs button{ flex:1; padding:0.977cqw 0; border:none; border-radius:0.586cqw; background:transparent; color:var(--muted); font-family:'Cormorant Garamond', serif; font-size:1.66cqw; letter-spacing:0.03em; cursor:pointer; transition:all .25s ease; }
          .tabs button.active{ background:linear-gradient(180deg, rgba(201,162,75,0.2), rgba(201,162,75,0.07)); color:var(--gold-light); box-shadow:inset 0 0 0 1px rgba(201,162,75,0.5); }
          
          label{ display:block; font-size:0.977cqw; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:0.781cqw; }
          .field{ margin-bottom:1.563cqw; flex-shrink: 0; }
          .field-row{ display:flex; justify-content:space-between; align-items:baseline; }
          .forgot{ font-size:0.977cqw; letter-spacing:0.13em; text-transform:uppercase; color:var(--gold); text-decoration:none; opacity:0.9; }
          .forgot:hover{ opacity:1; text-decoration:underline; }
          
          .input-wrap{ position:relative; display:flex; align-items:center; }
          .input-wrap svg{ position:absolute; left:1.27cqw; width:1.367cqw !important; height:1.367cqw !important; stroke:var(--muted); pointer-events:none; }
          .input-wrap input{ width:100%; padding:1.074cqw 3.906cqw 1.074cqw 3.711cqw; background:var(--input-bg); border:1px solid rgba(255,255,255,0.12); border-radius:0.684cqw; color:var(--cream); font-family:'Inter', sans-serif; font-size:1.27cqw; outline:none; transition:border-color .2s ease, box-shadow .2s ease; }
          .input-wrap input::placeholder{ color:#7a7466; }
          .input-wrap input:focus{ border-color:var(--gold); box-shadow:0 0 0 0.293cqw rgba(201,162,75,0.18); }
          
          .toggle-eye{ position:absolute; right:1.27cqw; width:1.465cqw; height:1.465cqw; stroke:var(--muted); cursor:pointer; background:none; border:none; padding:0; pointer-events:auto !important; }
          .toggle-eye svg { position: static !important; width: 100% !important; height: 100% !important; margin: 0; }
          
          .submit-btn{ width:100%; margin-top:0.586cqw; padding:1.172cqw 0; border:none; border-radius:0.684cqw; background:linear-gradient(180deg, var(--gold-light), var(--gold) 55%, #a8813a); color:#221a0e; font-family:'Inter', sans-serif; font-weight:600; font-size:1.172cqw; letter-spacing:0.13em; text-transform:uppercase; cursor:pointer; transition:transform .18s ease; flex-shrink: 0; }
          .submit-btn:hover{ transform:translateY(-1px); }
          .submit-btn:active{ transform:translateY(0); }
          .submit-btn:disabled{ opacity: 0.7; cursor: not-allowed; }
          
          .divider{ display:flex; align-items:center; gap:0.977cqw; margin:1.758cqw 0 1.563cqw; color:var(--muted); font-size:0.977cqw; letter-spacing:0.16em; text-transform:uppercase; flex-shrink: 0; }
          .divider::before, .divider::after{ content:""; flex:1; height:1px; background:rgba(255,255,255,0.1); }
          
          .ledge{ margin:auto -3.125cqw 0; padding:1.563cqw 3.125cqw 1.953cqw; background:var(--panel); flex-shrink: 0; border-top:1px solid rgba(255,255,255,0.05); }
          
          .oauth{ display:flex; gap:0.977cqw; }
          .oauth button{ flex:1; display:flex; align-items:center; justify-content:center; gap:0.781cqw; padding:1.074cqw 0; border:none; border-radius:0.684cqw; font-family:'Inter', sans-serif; font-weight:600; font-size:1.172cqw; letter-spacing:0.04em; cursor:pointer; transition:filter .15s ease; }
          .oauth button:hover{ filter:brightness(1.08); }
          .oauth .google{ background:#efe9dd; color:#231f18; }
          .oauth .apple{ background:#141414; color:#efe6d3; border:1px solid rgba(255,255,255,0.08); }
          .oauth svg{ width: 1.5cqw; height: 1.5cqw; }
          
          .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 0.684cqw; padding: 0.781cqw 1cqw; margin-bottom: 1cqw; color: #f87171; font-size: 0.9cqw; flex-shrink: 0; }
        `}</style>
        
        <div className="scene-wrapper">
          <div className="scene">
            <img src="/assets/images/banner_login_mockup.jpg" alt="Luxe Precision Background" className="bg" />
            
            <div className="card">
              <div className="tabs">
                <button 
                  className={tab === 'signin' ? 'active' : ''} 
                  onClick={() => { setTab('signin'); setError('') }}
                >
                  Sign In
                </button>
                <button 
                  className={tab === 'register' ? 'active' : ''} 
                  onClick={() => { setTab('register'); setError('') }}
                >
                  Register
                </button>
              </div>

              {tab === 'register' && (
                <>
                  <div className="field">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <User />
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={form.name}
                        onChange={e => update('name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Phone Number</label>
                    <div className="input-wrap">
                      <Phone />
                      <input 
                        type="tel" 
                        placeholder="Your phone number" 
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="field">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="field-row">
                  <label>Password</label>
                  {tab === 'signin' && (
                    <a href="#" className="forgot" onClick={e => e.preventDefault()}>Forgot?</a>
                  )}
                </div>
                <div className="input-wrap">
                  <Lock />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                  <button type="button" className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              
              {tab === 'register' && (
                <div className="field">
                  <label>Confirm Password</label>
                  <div className="input-wrap">
                    <Lock />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={e => update('confirmPassword', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                    <button type="button" className="toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-msg">
                  {error}
                </div>
              )}

              <button 
                className="submit-btn" 
                onClick={handleSubmit} 
                disabled={loading}
              >
                {loading ? 'Please wait...' : (tab === 'signin' ? 'Access Account' : 'Create Account')}
              </button>

              <div className="ledge">
                <div className="divider">Or continue with</div>
                <div className="oauth">
                  <button type="button" className="google">
                    <svg viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button type="button" className="apple">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
