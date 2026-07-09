import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, Mail, Phone } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gradient-to-b from-[#000000] to-[#FAF6ED] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-4 block">
            Security & Trust
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#FFFFFF] font-light mb-6 tracking-wide">
            Privacy Policy
          </h1>
          <p className="font-sans text-xs text-[#D4AF37] tracking-widest uppercase">
            Effective Date: July 6, 2026
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-[#000000]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_15px_40px_-10px_rgba(26,26,26,0.04)] text-white/60 space-y-10 leading-relaxed font-sans text-sm md:text-base font-light"
        >
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#D4AF37]" /> 1. Our Commitment
            </h2>
            <p>
              At Vedhika & Co., your privacy is of paramount importance to us. We are dedicated to maintaining the trust and confidence of our clients. This Privacy Policy explains how we collect, protect, and use your personal information when you browse our boutique showroom, order handloom weaves, or inquire about return gifts.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#D4AF37]" /> 2. Information We Collect
            </h2>
            <p>
              To provide a premium and personalized luxury service, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6E6E6E]">
              <li><strong>Personal Identifiers:</strong> Name, shipping/billing address, telephone numbers, and email address.</li>
              <li><strong>Authentication Data:</strong> User account credentials and secure tokens stored during login.</li>
              <li><strong>Order History:</strong> History of products purchased, added to cart, or saved to your wishlist.</li>
              <li><strong>Payment Data:</strong> Secure transaction references and billing details processed via encrypted third-party payment gateways (e.g. Razorpay). We do not store raw credit/debit card numbers on our servers.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#D4AF37]" /> 3. How We Use Your Data
            </h2>
            <p>
              The information we collect is utilized strictly for the following services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6E6E6E]">
              <li>Fulfilling and delivering your boutique orders and return gift packages.</li>
              <li>Processing secure payments and preventing fraudulent activities.</li>
              <li>Managing your user profile, purchase records, and personal wishlist.</li>
              <li>Communicating updates, delivery statuses, or responding to booking enquiries for private concierge styling.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#D4AF37]" /> 4. Data Security & Integrity
            </h2>
            <p>
              We implement industry-standard technical and organizational security measures to shield your data from unauthorized access, alteration, or disclosure. All network requests are encrypted using Secure Socket Layer (SSL/TLS) technology. User authorization is managed through secure JSON Web Tokens (JWT).
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#D4AF37]" /> 5. Contact Concierge
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding your personal data and privacy settings, please feel free to reach out to our team:
            </p>
            <div className="bg-[#FAF6ED] rounded-2xl p-6 border border-white/10 space-y-3 font-normal text-xs md:text-sm text-[#FFFFFF] max-w-md">
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a href="mailto:hello@vedhikabrand.com" className="hover:text-[#D4AF37] transition-colors">hello@vedhikabrand.com</a>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a href="tel:+919344149236" className="hover:text-[#D4AF37] transition-colors">+91 93441 49236</a>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
