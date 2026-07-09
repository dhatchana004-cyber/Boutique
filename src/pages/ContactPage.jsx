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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enquiryType: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    setFormData({ firstName: '', lastName: '', email: '', enquiryType: '', message: '' })
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
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-4 block">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#FFFFFF] font-light mb-6 tracking-wide leading-tight">
            Connect With Us
          </h1>
          <p className="font-sans text-sm md:text-base text-[#6E6E6E] leading-relaxed font-light">
            Whether you seek a bespoke bridal design, wish to explore corporate return gifts, or desire a personal boutique walkthrough, our concierge team is at your service.
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
                <div className="font-sans text-sm text-white/60 leading-relaxed font-light">
                  <p>Door No. 4/77/A, Happy Down,</p>
                  <p>Salaiyar, Nandhavanapatty,</p>
                  <p>Old Karur Road, Dindigul - 624 005.</p>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Vedhika+%26+Co+Nandhavanapatty+Old+Karur+Road+Dindigul" 
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
                  <p className="hover:text-[#D4AF37] transition-colors"><a href="tel:+919344149236">+91 93441 49236</a></p>
                  <p className="hover:text-[#D4AF37] transition-colors"><a href="tel:+919360435871">+91 93604 35871</a></p>
                </div>
                <div className="border-t border-white/10/60 pt-3.5 mt-3.5">
                  <p className="font-sans text-xs text-[#D4AF37] mb-3.5">
                    WhatsApp for bulk & bridal enquiries
                  </p>
                  <a 
                    href="https://wa.me/919344149236?text=Hello%20Vedhika%20%26%20Co,%20I%20would%20like%20to%20enquire%20about%20your%20services." 
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
                  <a href="mailto:hello@vedhikabrand.com" className="text-white/60 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                    hello@vedhikabrand.com <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a href="mailto:press@vedhikabrand.com" className="text-[#D4AF37] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                    press@vedhikabrand.com <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <div className="font-sans text-sm text-white/60 leading-relaxed font-light">
                  <p className="flex justify-between gap-4"><span>Mon – Sat:</span> <span className="font-semibold text-[#FFFFFF]">10:00 AM – 8:00 PM</span></p>
                  <p className="flex justify-between gap-4 mt-1"><span>Sunday:</span> <span className="text-[#D4AF37] italic">Closed (By Appointment)</span></p>
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
                    Send a Message
                  </h2>
                  <p className="font-sans text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase mb-8">
                    Bespoke consultations and enquiries
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
                          <option value="" disabled hidden>Please select</option>
                          <option value="Personal Shopping">Boutique • Personal Shopping</option>
                          <option value="Return Gifts Wedding">Return Gifts • Wedding</option>
                          <option value="Return Gifts Corporate">Return Gifts • Corporate</option>
                          <option value="Press Collaboration">Press & Collaboration</option>
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
                      className="mt-4 w-full bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-[#FFFFFF] py-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 group shadow-md cursor-pointer"
                    >
                      Send Enquiry
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-20 md:mt-28"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_15px_40px_-20px_rgba(26,26,26,0.08)] bg-[#000000] relative">
            <iframe 
              src="https://maps.google.com/maps?q=Nandhavanapatty,%20Old%20Karur%20Road,%20Dindigul&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              className="grayscale contrast-[1.15] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 w-full"
            ></iframe>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
