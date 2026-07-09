import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Page Not Found" />
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-6 block">
            Error 404
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#FFFFFF] font-light mb-8 tracking-wide leading-tight">
            Page Not <br />
            <span className="italic text-[#D4AF37]">Found</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-[#6E6E6E] leading-relaxed font-light mb-12 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 px-10 py-4 border border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#FFFFFF] transition-colors duration-500"
          >
            Return to Boutique <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </>
  );
}
