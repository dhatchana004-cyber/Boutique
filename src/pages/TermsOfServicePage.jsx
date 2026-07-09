import { motion } from 'framer-motion'
import { FileText, ShoppingBag, CreditCard, RefreshCw, AlertTriangle, Mail, Phone } from 'lucide-react'

export default function TermsOfServicePage() {
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
            Rules & Conditions
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#FFFFFF] font-light mb-6 tracking-wide">
            Terms of Service
          </h1>
          <p className="font-sans text-xs text-[#D4AF37] tracking-widest uppercase">
            Last Updated: July 6, 2026
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
              <FileText className="w-5 h-5 text-[#D4AF37]" /> 1. Agreement to Terms
            </h2>
            <p>
              By accessing and using the digital boutique platform of Vedhika & Co., you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to review, update, or modify these terms at any time without prior notice.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> 2. Boutique Purchases & Orders
            </h2>
            <p>
              All products listed—including handloom sarees, boutique items, and return gift baskets—are subject to availability.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6E6E6E]">
              <li><strong>Pricing:</strong> All prices are in Indian Rupees (INR) and are inclusive of local taxes where applicable. Custom duties or international shipping rates are computed separately.</li>
              <li><strong>Product Variations:</strong> Since many of our boutique sarees are authentic, handwoven pieces, subtle variations in colors, textures, and zari weaves are characteristics of artisanal handloom and are not deemed defects.</li>
              <li><strong>Order Cancellation:</strong> We reserve the right to refuse or cancel any order if a product is listed at an incorrect price, has inventory shortages, or if fraud is suspected.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" /> 3. Payments & Secure Gateways
            </h2>
            <p>
              We provide secure payment options, including Cash on Delivery (COD) and online payments processed via verified payment service providers (e.g. Razorpay). By initiating a transaction, you authorize our third-party payment partner to charge the specified transaction value to your selected payment method.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#D4AF37]" /> 4. Returns & Exchanges
            </h2>
            <p>
              To maintain the exclusive nature of our designer pieces and luxury return gift bundles:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#6E6E6E]">
              <li>Exchanges or return requests must be raised within 7 days of receiving the order, subject to verification.</li>
              <li>Items must be returned in their original condition, unwashed, unaltered, and with all boutique tags and luxury packaging intact.</li>
              <li>Bespoke customized bridal designs, tailored items, and personalized bulk return gifts are non-refundable and cannot be exchanged.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D4AF37]" /> 5. Limitation of Liability
            </h2>
            <p>
              Vedhika & Co. shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website, delivery delays due to logistics partner operations, or unexpected stock shortages.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#FFFFFF] font-medium flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#D4AF37]" /> 6. Customer Enquiries
            </h2>
            <p>
              If you have any questions or require support regarding our Terms of Service, billing details, or delivery schedules, please contact our concierge service:
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
