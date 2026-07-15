import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useSiteContent } from '../hooks/useSiteContent';

export default function AboutPage() {
  const navigate = useNavigate();
  const { content, loading } = useSiteContent('about', {
    heroTag: 'Our Legacy', heroTitle: 'A Tradition of Excellence', heroDesc: 'Founded on the principles of timeless craftsmanship and uncompromising quality, Luxe Precision brings you curations that define heritage and sophistication.',
    img1: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
    quoteText: '"We don\'t just create garments; we weave stories of heritage, preserving the art of the loom for the modern connoisseur."', quoteAuthor: '— The Founders'
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <>
      <SEO title="Our Heritage" description="Discover the legacy of Luxe Precision, where timeless heritage meets modern elegance." />
      <div className="bg-[#000000] min-h-screen pt-28 pb-20">
        
        {/* Hero Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-6 block">
              {content.heroTag}
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#FFFFFF] font-light mb-8 tracking-wide leading-[1.1]" dangerouslySetInnerHTML={{ __html: content.heroTitle.replace(/Excellence/g, '<span class="italic text-[#D4AF37]">Excellence</span>') }} />
            <p className="font-sans text-sm md:text-base text-[#6E6E6E] leading-relaxed font-light max-w-2xl mx-auto">
              {content.heroDesc}
            </p>
          </motion.div>
        </section>

        {/* Brand Story Image Grid */}
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <motion.div variants={fadeUp} className="md:col-span-8 relative aspect-[16/9] md:aspect-auto md:h-[500px] overflow-hidden rounded-sm group">
              <img 
                src={content.img1} 
                alt="Heritage Craftsmanship" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-4 relative aspect-[4/5] md:aspect-auto md:h-[500px] overflow-hidden rounded-sm group">
              <img 
                src={content.img2} 
                alt="Bespoke Design" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
            </motion.div>
          </motion.div>
        </section>

        {/* Philosophy Text Section */}
        <section className="px-6 max-w-5xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Star className="w-8 h-8 text-[#D4AF37] mx-auto mb-8" strokeWidth={1} />
            <h2 className="text-3xl md:text-5xl font-serif text-[#FFFFFF] leading-[1.3] mb-8">
              {content.quoteText}
            </h2>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#D4AF37] font-bold">
              {content.quoteAuthor}
            </p>
          </motion.div>
        </section>

        {/* Stats / Pillars */}
        <section className="px-6 max-w-7xl mx-auto mb-32 border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { icon: Award, title: "Master Artisans", desc: "Collaborating with generational weavers across the country." },
              { icon: Heart, title: "Ethical Luxury", desc: "Sustainable practices meeting uncompromising quality standards." },
              { icon: Star, title: "Bespoke Service", desc: "A concierge dedicated to your styling and gifting needs." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="text-center px-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-[#FFFFFF] mb-4">{item.title}</h3>
                <p className="font-sans text-sm text-[#6E6E6E] leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 text-center pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-3 px-12 py-5 bg-[#D4AF37] text-[#000000] text-[10px] font-bold uppercase tracking-widest hover:bg-[#FFFFFF] transition-colors duration-500"
            >
              Explore The Collections <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </section>

      </div>
    </>
  );
}
