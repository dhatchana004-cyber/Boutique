import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  Send, 
  CheckCircle, 
  MessageCircle, 
  ExternalLink,
  ChevronDown
} from 'lucide-react'
import api from '../services/api'

import { useSiteContent } from '../hooks/useSiteContent'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enquiryType: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)
  
  const { content } = useSiteContent('contact', {
    headerTag: 'Get In Touch', headerTitle: 'Connect With Us', headerDesc: 'Whether you seek a bespoke bridal design, wish to explore corporate return gifts, or desire a personal boutique walkthrough, our concierge team is at your service.',
    address: 'Door No. 4/77/A, Happy Down,\nSalaiyar, Nandhavanapatty,\nOld Karur Road, Dindigul - 624 005.', phone1: '+91 93441 49236', phone2: '+91 93604 35871',
    email: 'concierge@vedhika.co.in', hours: 'Mon - Sat: 10:00 AM - 8:00 PM\nSunday: By Appointment Only',
    formTitle: 'Send a Message', formDesc: 'Bespoke consultations and enquiries', storeImage: ''
  })
  const { content: socialLinks } = useSiteContent('social', { whatsapp: '' })

  const getWhatsappLink = (num) => {
    if (!num) return ''
    const strNum = String(num).trim();
    if (strNum.startsWith('http')) return strNum;
    let cleanNum = strNum.replace(/[^0-9]/g, '');
    if (!cleanNum) return '';
    if (cleanNum.length === 10) cleanNum = '91' + cleanNum;
    return `https://wa.me/${cleanNum}?text=Hello%20Vedhika%20%26%20Co,%20I%20would%20like%20to%20enquire%20about%20your%20services.`;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;
    setIsSubmitting(true)
    try {
      const response = await api.post('/enquiries', formData)
      if (response.data.success) {
        setIsSubmitted(true)
        setFormData({ firstName: '', lastName: '', email: '', enquiryType: '', message: '' })
      }
    } catch (error) {
      console.error("Failed to submit enquiry:", error)
      setNotification({ message: 'Failed to submit enquiry. Please try again.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="bg-gradient-to-b from-[#000000] to-[#FAF6ED] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
        >
          <span className="inline-block text-[9px] font-sans font-bold tracking-[0.3em] text-[#D4AF37] mb-4 bg-[#D4AF37]/10 px-3 py-1 rounded-sm uppercase">
            {content.headerTag}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#FFFFFF] font-light mb-6 tracking-wide leading-tight">
            {content.headerTitle}
          </h1>
          <p className="font-sans text-sm md:text-base text-[#6E6E6E] leading-relaxed font-light">
            {content.headerDesc}
          </p>
        </motion.div>

        {/* Main Grid: Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Address Card */}
            <motion.div 
              variants={itemVariants}
              className="group bg-[#000000]/40 hover:bg-[#000000]/90 backdrop-blur-sm border border-white/10/60 hover:border-[#D4AF37]/40 transition-all duration-500 rounded-3xl p-7 shadow-[0_10px_30px_-10px_rgba(26,26,26,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(197,168,128,0.08)] flex gap-5"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] mb-2.5">
                  Flagship Boutique
                </h3>
                <div className="font-sans text-sm text-white/60 leading-relaxed font-light whitespace-pre-line">
                  <p>{content.address}</p>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Vedhika+Return+Gifts+and+wear+fashion,+Nandhavanappatty,+Dindigul" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#D4AF37] hover:text-[#FFFFFF] mt-4 transition-colors duration-300 group/link"
                >
                  Get Directions 
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Concierge Card */}
            <motion.div 
              variants={itemVariants}
              className="group bg-[#000000]/40 hover:bg-[#000000]/90 backdrop-blur-sm border border-white/10/60 hover:border-[#D4AF37]/40 transition-all duration-500 rounded-3xl p-7 shadow-[0_10px_30px_-10px_rgba(26,26,26,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(197,168,128,0.08)] flex gap-5"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] mb-2.5">
                  Concierge
                </h3>
                <div className="font-sans text-sm text-white/60 leading-relaxed font-light mb-3">
                  <p className="hover:text-[#D4AF37] transition-colors"><a href={`tel:${content.phone1.replace(/\s+/g, '')}`}>{content.phone1}</a></p>
                  {content.phone2 && <p className="hover:text-[#D4AF37] transition-colors"><a href={`tel:${content.phone2.replace(/\s+/g, '')}`}>{content.phone2}</a></p>}
                </div>
                <div className="border-t border-white/10/60 pt-3.5 mt-3.5">
                  <p className="font-sans text-xs text-[#D4AF37] mb-3.5">
                    WhatsApp for bulk & bridal enquiries
                  </p>
                  <a 
                    href={getWhatsappLink(socialLinks.whatsapp) || '#'}
                    onClick={(e) => {
                      if (!getWhatsappLink(socialLinks.whatsapp)) {
                        e.preventDefault();
                        alert("Please configure your WhatsApp link/number in the Admin Panel (Social Tab) and click 'Save Changes'.");
                      }
                    }}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-white px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div 
              variants={itemVariants}
              className="group bg-[#000000]/40 hover:bg-[#000000]/90 backdrop-blur-sm border border-white/10/60 hover:border-[#D4AF37]/40 transition-all duration-500 rounded-3xl p-7 shadow-[0_10px_30px_-10px_rgba(26,26,26,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(197,168,128,0.08)] flex gap-5"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] mb-2.5">
                  Write To Us
                </h3>
                <div className="font-sans text-sm leading-relaxed flex flex-col gap-2 font-light">
                  <a href={`mailto:${content.email}`} className="text-white/60 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                    {content.email} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div 
              variants={itemVariants}
              className="group bg-[#000000]/40 hover:bg-[#000000]/90 backdrop-blur-sm border border-white/10/60 hover:border-[#D4AF37]/40 transition-all duration-500 rounded-3xl p-7 shadow-[0_10px_30px_-10px_rgba(26,26,26,0.02)] hover:shadow-[0_20px_40px_-10px_rgba(197,168,128,0.08)] flex gap-5"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                <Clock className="w-5 h-5" />
              </div>
              <div className="w-full">
                <h3 className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] mb-2.5">
                  Boutique Hours
                </h3>
                <div className="font-sans text-sm text-white/60 leading-relaxed font-light whitespace-pre-line mt-1">
                  <p>{content.hours}</p>
                </div>
              </div>
            </motion.div>

            {/* Social Follow */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-5 px-3 py-1 mt-2"
            >
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
                Follow:
              </span>
              <div className="flex items-center gap-6">
                <a href="#" className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] hover:text-[#D4AF37] transition-colors relative group/social">
                  Instagram
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover/social:w-full transition-all duration-300" />
                </a>
                <a href="#" className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#FFFFFF] hover:text-[#D4AF37] transition-colors relative group/social">
                  Pinterest
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover/social:w-full transition-all duration-300" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Contact Form / Success state with AnimatePresence */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-[#000000]/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_15px_40px_-10px_rgba(26,26,26,0.04)] text-center flex flex-col items-center justify-center min-h-[480px]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="font-serif text-3xl text-[#FFFFFF] font-light mb-4">
                    Enquiry Received
                  </h2>
                  <p className="font-sans text-sm text-[#6E6E6E] leading-relaxed font-light max-w-md mb-8">
                    Thank you for contacting Vedhika & Co. Your enquiry details have been successfully received by our concierge service. We will review and reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-8 py-3.5 bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-[#FFFFFF] rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-[#000000]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_15px_40px_-10px_rgba(26,26,26,0.04)]"
                >
                  <h2 className="font-serif text-2xl text-[#FFFFFF] font-light mb-2">
                    {content.formTitle}
                  </h2>
                  <p className="font-sans text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase mb-8">
                    {content.formDesc}
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* First Name */}
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="peer w-full bg-transparent border-b border-[#FFFFFF]/15 py-3 text-sm font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-transparent"
                          placeholder="First Name"
                        />
                        <label className="absolute left-0 top-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37] transition-all origin-left cursor-text pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#D4AF37]">
                          First Name
                        </label>
                      </div>
                      
                      {/* Last Name */}
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="peer w-full bg-transparent border-b border-[#FFFFFF]/15 py-3 text-sm font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-transparent"
                          placeholder="Last Name"
                        />
                        <label className="absolute left-0 top-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37] transition-all origin-left cursor-text pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#D4AF37]">
                          Last Name
                        </label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="peer w-full bg-transparent border-b border-[#FFFFFF]/15 py-3 text-sm font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-transparent"
                        placeholder="Email Address"
                      />
                      <label className="absolute left-0 top-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37] transition-all origin-left cursor-text pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#D4AF37]">
                        Email Address
                      </label>
                    </div>

                    {/* Enquiry Type */}
                    <div className="relative flex flex-col gap-2 mt-2">
                      <label className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37]">
                        Enquiry Type
                      </label>
                      <div className="relative">
                        <select
                          name="enquiryType"
                          value={formData.enquiryType}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent border-b border-[#FFFFFF]/15 py-3 text-sm font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-10"
                        >
                          <option className="bg-[#111111] text-white" value="" disabled hidden>Please select</option>
                          <option className="bg-[#111111] text-white" value="Personal Shopping">Boutique • Personal Shopping</option>
                          <option className="bg-[#111111] text-white" value="Return Gifts Wedding">Return Gifts • Wedding</option>
                          <option className="bg-[#111111] text-white" value="Return Gifts Corporate">Return Gifts • Corporate</option>
                          <option className="bg-[#111111] text-white" value="Press Collaboration">Press & Collaboration</option>
                        </select>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37] w-4 h-4 flex items-center justify-center">
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="relative mt-2">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="1"
                        className="peer w-full bg-transparent border-b border-[#FFFFFF]/15 py-3 text-sm font-sans text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-transparent resize-none overflow-hidden min-h-[60px]"
                        placeholder="Your Message"
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = (e.target.scrollHeight) + 'px';
                        }}
                      ></textarea>
                      <label className="absolute left-0 top-3 text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37] transition-all origin-left cursor-text pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#D4AF37]">
                        Your Message
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 w-full bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-[#FFFFFF] py-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 group shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                      {!isSubmitting && <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Map or Store Image Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-20 md:mt-28"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_15px_40px_-20px_rgba(26,26,26,0.08)] bg-[#000000] relative">
            {content.storeImage ? (
              <img src={content.storeImage} alt="Store Location" className="w-full h-[450px] object-cover opacity-80 hover:opacity-100 transition-all duration-700" />
            ) : (
              <iframe 
                src="https://maps.google.com/maps?q=Vedhika+Return+Gifts+and+wear+fashion,+Nandhavanappatty,+Dindigul&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                className="grayscale contrast-[1.15] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 w-full"
              ></iframe>
            )}
          </div>
        </motion.div>

      </div>

      {/* Custom Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111111] w-full max-w-sm rounded-2xl border border-[#333333] shadow-2xl overflow-hidden p-6 text-center animate-slide-up">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${notification.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
              {notification.type === 'error' ? '✕' : '✓'}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {notification.type === 'error' ? 'Error' : 'Success'}
            </h3>
            <p className="text-sm text-gray-400 mb-6">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-yellow-500 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
