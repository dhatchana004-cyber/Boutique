import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, ArrowRight, Gift, Scissors, Star } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import MagneticButton from '../components/common/MagneticButton'
import { productService } from '../services/productService'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/currency'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import StyleQuizModal from '../components/discovery/StyleQuizModal'

import { useSiteContent } from '../hooks/useSiteContent'

function HeroSlider() {
  const navigate = useNavigate();
  const { content } = useSiteContent('home', {
    title: 'LUXE PRECISION',
    subtitle: 'Discover The Collection',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200'
  });

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={content.imageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200'}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-center text-[#FDFBF7] px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-serif text-4xl md:text-6xl tracking-widest mb-6"
        >
          {content.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-sans text-sm md:text-base tracking-[0.2em] uppercase mb-10 text-[#C5A880]"
        >
          {content.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-500 font-sans tracking-widest uppercase text-xs"
          >
            Explore
          </button>
        </motion.div>
      </div>
    </section>
  );
}


function ScrollCounter({ from = 0, to, duration = 2 }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let startTime = null;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
          node.textContent = Math.floor(progress * (to - from) + from);
          if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
}

function BrandStats() {
  const { content } = useSiteContent('home', {
    stat1Num: '10', stat1Label: 'Happy Clients', stat2Num: '50', stat2Label: 'Global Brands',
    stat3Num: '99', stat3Label: 'Satisfaction', stat4Num: '1992', stat4Label: 'Est. Heritage'
  });

  return (
    <section className="py-20 px-6 bg-[#0a0a0a] border-y border-[#333333]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-2 flex items-center">
            <ScrollCounter from={0} to={parseInt(content.stat1Num) || 10} /><span className="text-3xl ml-1">k+</span>
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{content.stat1Label}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-2 flex items-center">
            <ScrollCounter from={0} to={parseInt(content.stat2Num) || 50} /><span className="text-3xl ml-1">+</span>
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{content.stat2Label}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-2 flex items-center">
            <ScrollCounter from={0} to={parseInt(content.stat3Num) || 99} /><span className="text-3xl ml-1">%</span>
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{content.stat3Label}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-2">
            <ScrollCounter from={1980} to={parseInt(content.stat4Num) || 1992} />
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{content.stat4Label}</p>
        </div>
      </div>
    </section>
  )
}

function StickyScrollEditorial() {
  const { content } = useSiteContent('home', {
    editorialTag: 'The Lookbook', 
    editorialTitle: 'Editorial Elegance', 
    editorialDesc: 'A curated selection of the season\'s most coveted pieces, blending timeless heritage craftsmanship with modern avant-garde silhouettes designed for the discerning few.',
    editorialImg1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200',
    editorialImg2: '/assets/images/velvet_jewel_box.png',
    editorialImg3: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200'
  });

  const images = [
    content.editorialImg1 || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200',
    content.editorialImg2 || '/assets/images/velvet_jewel_box.png',
    content.editorialImg3 || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200'
  ]

  return (
    <section className="relative bg-[#000000] py-24 md:py-40 px-6 border-t border-[#FFFFFF]/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 relative">
        
        {/* Sticky Left Column */}
        <div className="md:w-5/12 md:sticky md:top-32 h-fit">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-[#D4AF37] mb-6 flex items-center gap-4"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]"></span> {content.editorialTag}
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-serif text-[#FFFFFF] leading-[1.1] mb-8"
          >
            {content.editorialTitle}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-sm md:text-base text-[#D4AF37] leading-relaxed max-w-sm mb-12 font-light"
          >
            {content.editorialDesc}
          </motion.p>

          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="px-10 py-4 bg-[#111111] text-[#FFFFFF] text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] transition-colors duration-500"
          >
            Shop The Collection
          </motion.button>
        </div>

        {/* Scrolling Right Column */}
        <div className="md:w-7/12 flex flex-col gap-16 md:gap-32 mt-10 md:mt-0">
          {images.map((src, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] md:aspect-[4/5] rounded-sm overflow-hidden bg-[#F0EBE1] shadow-2xl"
            >
              <img 
                src={src} 
                alt={`Editorial Look ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AtelierExperience() {
  const navigate = useNavigate()
  const { content } = useSiteContent('home', {
    atelierTag: 'The Atelier Experience', 
    atelierTitle: 'A Private Salon <br/> <span className="italic text-[#D4AF37]">Through Custom Luxury</span>', 
    atelierDesc: 'Step into our curated flagship showroom. Each drape, silk thread, and zari weave is hand-selected to offer an experience of unparalleled elegance. Whether curating returns for grand milestones or selecting bridal masterpieces, our gifting concierge ensures personalized perfection down to the final ribbon.', 
    atelierImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200'
  });

  return (
    <section className="py-24 md:py-32 px-6 bg-[#111111] text-[#FFFFFF] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">
        
        {/* Left text column */}
        <div className="w-full lg:w-5/12">
          <p className="text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-[#D4AF37] mb-6 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#D4AF37]"></span> {content.atelierTag}
          </p>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-[1.15] mb-8" dangerouslySetInnerHTML={{ __html: content.atelierTitle }} />

          <p className="font-sans text-sm md:text-base text-white/60 leading-relaxed mb-10 font-light max-w-sm">
            {content.atelierDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <MagneticButton 
              onClick={() => navigate('/products')}
              className="px-10 py-4 bg-[#D4AF37] text-[#FFFFFF] text-[10px] font-sans font-bold tracking-widest uppercase hover:bg-[#000000] hover:text-[#FFFFFF] transition-all duration-500 shadow-[0_0_20px_rgba(197,168,128,0.2)]"
            >
              Explore The Gallery
            </MagneticButton>
            <MagneticButton 
              onClick={() => navigate('/contact')}
              className="px-10 py-4 bg-transparent border border-white/20 text-[#FFFFFF] text-[10px] font-sans font-semibold tracking-widest uppercase hover:bg-[#000000] hover:text-[#FFFFFF] transition-all duration-500"
            >
              Book A Styling Session
            </MagneticButton>
          </div>
        </div>

        {/* Right image column with premium styling */}
        <div className="w-full lg:w-7/12 flex justify-center lg:justify-end">
          <div className="relative p-4 md:p-6 bg-[#000000]/[0.02] border border-white/10 rounded-[32px] backdrop-blur-sm shadow-2xl max-w-xl group">
            {/* Elegant outer gold border details */}
            <div className="absolute inset-0 border border-[#D4AF37]/15 rounded-[32px] pointer-events-none scale-[1.02] group-hover:scale-[1.03] transition-transform duration-700" />
            
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#111111]">
              <img 
                src={content.atelierImage || '/assets/images/boutique_rack.jpg'} 
                alt="Flagship Boutique Rack" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}



function ModernServices() {
  const services = [
    { num: '01', title: 'Curated Gifting', desc: 'Sourced from master artisans globally, ensuring every piece tells a story.' },
    { num: '02', title: 'Personal Shopping', desc: 'A dedicated concierge to guide you through our exclusive private reserves.' },
    { num: '03', title: 'Bespoke Packaging', desc: 'Wrapped in our signature atelier materials, unboxing becomes an experience.' },
  ]

  return (
    <section className="py-16 px-6 bg-[#111111] text-[#FFFFFF] border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/3"
        >
          <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#D4AF37] mb-4 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#D4AF37]"></span> The Philosophy
          </p>
          <h2 className="text-3xl md:text-5xl font-serif leading-[1.2] mb-6">Elevating The Art <br/><span className="italic text-[#D4AF37]">of Giving</span></h2>
          <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed font-light mb-8">
            We believe that true luxury lies in the details. From the moment you begin your search to the final unwrapping, every touchpoint is meticulously crafted to inspire awe.
          </p>
          <MagneticButton className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#FFFFFF] transition-colors duration-500">
            Our Heritage
          </MagneticButton>
        </motion.div>
        
        <div className="lg:w-2/3 flex flex-col gap-4">
          {services.map((svc, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={i} 
              className="group relative flex items-start gap-6 p-6 md:p-8 border border-white/10 rounded-2xl bg-[#000000]/[0.02] hover:bg-[#000000]/[0.05] transition-colors duration-500 cursor-pointer overflow-hidden"
            >
              {/* Glassmorphism Hover Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <span className="font-serif text-3xl md:text-5xl text-white/10 group-hover:text-[#D4AF37] transition-colors duration-500">
                {svc.num}
              </span>
              <div className="relative z-10">
                <h3 className="font-serif text-2xl md:text-3xl mb-4 text-white group-hover:text-[#FFFFFF] transition-colors">{svc.title}</h3>
                <p className="font-sans text-sm text-white/40 leading-relaxed max-w-md group-hover:text-white/70 transition-colors">
                  {svc.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PremiumNewsletter() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])

  return (
    <section ref={ref} className="relative py-40 px-6 overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* Background Image with heavy overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          style={{ y, scale: 1.4 }}
          src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1920" 
          className="w-full h-full object-cover grayscale-[50%]"
          alt="Luxury Background"
        />
        <div className="absolute inset-0 bg-[#111111]/90 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto border border-[#D4AF37]/30 rounded-full flex items-center justify-center mb-10">
          <Heart className="w-6 h-6 text-[#D4AF37]" strokeWidth={1} />
        </div>
        <h2 className="text-3xl md:text-6xl font-serif text-[#FFFFFF] mb-4 md:mb-6">Join The <span className="italic text-[#D4AF37]">Inner Circle</span></h2>
        <p className="font-sans text-[10px] md:text-sm text-[#FFFFFF]/60 tracking-[0.2em] uppercase leading-relaxed mb-10 md:mb-16 max-w-lg mx-auto font-light">
          An exclusive invitation to receive early access to new collections and private events.
        </p>
        
        <form className="relative flex flex-col md:flex-row justify-center items-center max-w-xl mx-auto group" onSubmit={(e) => e.preventDefault()}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <input 
            type="email" 
            placeholder="ENTER YOUR EMAIL" 
            className="relative w-full bg-black/40 border border-white/20 px-8 py-5 text-[#FFFFFF] placeholder:text-[#FFFFFF]/30 focus:outline-none focus:border-[#D4AF37] font-sans text-xs tracking-widest transition-colors duration-500 rounded-none md:rounded-l-sm backdrop-blur-md"
          />
          <MagneticButton className="relative w-full md:w-auto px-12 py-5 bg-[#D4AF37] text-[#FFFFFF] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#000000] transition-colors duration-500 shrink-0 md:rounded-r-sm mt-4 md:mt-0 z-10">
            Unlock
          </MagneticButton>
        </form>
      </div>
    </section>
  )
}

function FlagshipShowroom() {
  const navigate = useNavigate()
  
  return (
    <section className="py-24 md:py-32 px-6 bg-[#000000] border-t border-[#FFFFFF]/5 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        
        {/* Left Side: Brand Philosophy & Curation */}
        <div className="w-full lg:w-5/12 space-y-8">
          <div>
            <span className="text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase text-[#D4AF37] mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#D4AF37]"></span> The Boutique Experience
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-[1.1] font-normal">
              Our Flagship <br/>
              <span className="italic text-[#D4AF37]">Atelier Showroom</span>
            </h2>
          </div>
          
          <p className="font-sans text-sm md:text-base text-[#D4AF37] leading-relaxed font-light">
            We invite you to experience our collections in person. Our flagship boutique showroom houses exclusive weaves, bespoke bridal couture, and curated gift hampers. Step in to touch the pure mulberry silks, feel the hand-embroidered zari details, and enjoy a private shopping session with our styling concierge.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#333333]">
            <div>
              <p className="font-serif text-3xl text-[#D4AF37] font-normal">100%</p>
              <p className="text-[10px] font-sans tracking-widest text-[#D4AF37] uppercase font-bold mt-1">Authentic Handloom</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-[#D4AF37] font-normal">Atelier</p>
              <p className="text-[10px] font-sans tracking-widest text-[#D4AF37] uppercase font-bold mt-1">Private Styling</p>
            </div>
          </div>

          <div className="pt-2">
            <MagneticButton 
              onClick={() => navigate('/products')}
              className="px-10 py-4.5 bg-[#111111] text-[#FFFFFF] text-[10px] font-sans tracking-widest uppercase hover:bg-[#D4AF37] transition-colors duration-500 rounded-sm"
            >
              Explore Curation Catalog
            </MagneticButton>
          </div>
        </div>

        {/* Right Side: Asymmetric Interactive Collage Grid */}
        <div className="w-full lg:w-7/12 grid grid-cols-12 gap-4">
          
          {/* Mannequins Image (Tall Card) - Columns 1-6 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-6 relative aspect-[3/4.5] rounded-3xl overflow-hidden shadow-xl group border border-[#333333] bg-[#F5F2EB]"
          >
            <img 
              src="/assets/images/boutique_4.jpg" 
              alt="Heritage Mannequins" 
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 z-10 text-left">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Collection Showcase</span>
              <h4 className="text-lg md:text-xl font-serif text-[#FFFFFF] mt-1">Bridal & Ethnic Couture</h4>
            </div>
          </motion.div>

          {/* Racks & Shelves Image (Top Right) - Columns 7-12 */}
          <div className="col-span-6 flex flex-col gap-4">
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group border border-[#333333] bg-[#F5F2EB]"
            >
              <img 
                src="/assets/images/boutique_1.jpg" 
                alt="Boutique Racks" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute bottom-5 left-5 z-10 text-left">
                <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Atelier Shelves</span>
                <h4 className="text-sm font-serif text-[#FFFFFF] mt-0.5">Pure Handloom Sarees</h4>
              </div>
            </motion.div>

            {/* Hanging Fabrics Image (Middle Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group border border-[#333333] bg-[#F5F2EB]"
            >
              <img 
                src="/assets/images/boutique_2.jpg" 
                alt="Colorful Fabrics" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="absolute bottom-5 left-5 z-10 text-left">
                <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Fabric Showcase</span>
                <h4 className="text-sm font-serif text-[#FFFFFF] mt-0.5">Silk & Georgette Fabrics</h4>
              </div>
            </motion.div>

          </div>

          {/* Mall Boutique Storefront (Full Width Bottom) - Columns 1-12 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 relative aspect-[21/9] rounded-3xl overflow-hidden shadow-xl group border border-[#333333] bg-[#F5F2EB] mt-2"
          >
            <img 
              src="/assets/images/boutique_3.jpg" 
              alt="Boutique Storefront" 
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 z-10 text-left">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Storefront Tour</span>
              <h4 className="text-lg md:text-xl font-serif text-[#FFFFFF] mt-1">Vedhika & Co. Boutique</h4>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizPrefs, setQuizPrefs] = useState(null)

  useEffect(() => {
    try {
      const prefs = localStorage.getItem('style_preferences')
      if (prefs) setQuizPrefs(JSON.parse(prefs))
    } catch(e) {}
    
    let mounted = true
    const fetchFeatured = async () => {
      try {
        const res = await productService.getFeaturedProducts()
        if (mounted && res.success) {
          setFeatured(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchFeatured()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <SEO />
      <PageTransition><main className="bg-[#000000] min-h-screen">
        <HeroSlider />
        <StyleQuizModal onComplete={setQuizPrefs} />
        
        {quizPrefs && (
          <section className="py-20 px-6 bg-[#111111] border-b border-[#333333]">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#C5A880] mb-4">Curated For You</p>
              <h2 className="text-3xl md:text-5xl font-serif text-[#FDFBF7] mb-6">Your {quizPrefs.style.split('&')[0].trim()} Collection</h2>
              <p className="text-sm md:text-base text-[#FDFBF7]/60 font-sans max-w-xl mx-auto mb-10 font-light">
                Based on your preference for {quizPrefs.category.toLowerCase()} in {quizPrefs.color.toLowerCase()}. We've handpicked pieces that perfectly align with your aesthetic.
              </p>
              <MagneticButton onClick={() => window.location.href = '/products?curated=true'} className="px-8 py-4 border border-[#C5A880] text-[#C5A880] text-[10px] uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-colors duration-500 font-bold">
                View All Matches
              </MagneticButton>
            </div>
          </section>
        )}
      
      <BrandStats />
      <StickyScrollEditorial />
      <AtelierExperience />
      
      <ModernServices />
      <FlagshipShowroom />
        <PremiumNewsletter />
      </main></PageTransition>
    </>
  )
}
