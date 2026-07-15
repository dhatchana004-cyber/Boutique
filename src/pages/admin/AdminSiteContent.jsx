import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Save, Loader } from 'lucide-react';
import { getSitePageContent, saveSiteContent } from '../../hooks/useSiteContent';

const PAGES = ['home', 'boutique', 'return-gifts', 'about', 'contact'];

export default function AdminSiteContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [contentData, setContentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
  };

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = () => {
    setLoading(true);
    const defaults = getDefaults(activeTab);
    const saved = getSitePageContent(activeTab);
    
    if (saved && Object.keys(saved).length > 0) {
      const merged = { ...defaults };
      Object.keys(saved).forEach(key => {
        if (saved[key] && typeof saved[key] === 'string' && saved[key].trim() !== '') {
          merged[key] = saved[key];
        } else if (saved[key] && typeof saved[key] !== 'string') {
          merged[key] = saved[key];
        }
      });
      setContentData(merged);
    } else {
      setContentData(defaults);
    }
    setLoading(false);
  };

  const getDefaults = (page) => {
    if (page === 'home') return { 
      title: 'LUXE PRECISION', subtitle: 'DISCOVER THE COLLECTION', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200',
      stat1Num: '10', stat1Label: 'Happy Clients', stat2Num: '50', stat2Label: 'Global Brands',
      stat3Num: '99', stat3Label: 'Satisfaction', stat4Num: '1992', stat4Label: 'Est. Heritage',
      editorialTag: 'The Lookbook', editorialTitle: 'Editorial Elegance', editorialDesc: 'A curated selection of the season\'s most coveted pieces, blending timeless heritage craftsmanship with modern avant-garde silhouettes designed for the discerning few.',
      editorialImg1: 'https://images.unsplash.com/photo-1583391733958-d25e07fac66a?q=80&w=800', editorialImg2: 'https://images.unsplash.com/photo-1617265114884-257a5adbc2f4?q=80&w=800', editorialImg3: 'https://images.unsplash.com/photo-1550614000-4b954cb37fbd?q=80&w=800',
      atelierTag: 'The Atelier Experience', atelierTitle: 'A Private Salon Through Custom Luxury', atelierDesc: 'Step into our curated flagship showroom. Each drape, silk thread, and zari weave is hand-selected to offer an experience of unparalleled elegance. Whether curating returns for grand milestones or selecting bridal masterpieces, our gifting concierge ensures personalized perfection down to the final ribbon.', atelierImage: 'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?q=80&w=800'
    };
    if (page === 'boutique') return { 
      heritageTag: '✦ Custom Handloom Weaves', heritageTitle: 'The Heritage Boutique', heritageDesc: 'Drape yourself in royal garments spun with absolute devotion. Our boutique catalog houses authentic pure Banarasi silks, handloom Kanchipuram sarees, and Gota Patti embroidered suites direct from artisanal houses.', 
      atelierTag: '✦ Flagship Experience', atelierTitle: 'Inside Our Atelier', atelierDesc: 'Explore the curated spaces of our physical boutique showroom. Each collection is meticulously organized to offer a sensory journey through India\'s finest handloom craftsmanship and heritage designs.',
      showroomImg1: '/assets/images/boutique_4.jpg', showroomText1: 'Exquisite Heritage Silks', showroomImg2: '/assets/images/boutique_1.jpg', showroomText2: 'Fine Handloom Weaves', showroomImg3: '/assets/images/boutique_2.jpg', showroomText3: 'Zari Embroidered Kurtis', showroomImg4: '/assets/images/boutique_3.jpg', showroomText4: 'Bridal Masterpieces'
    };
    if (page === 'contact') return { 
      headerTag: 'Get In Touch', headerTitle: 'Connect With Us', headerDesc: 'Whether you seek a bespoke bridal design, wish to explore corporate return gifts, or desire a personal boutique walkthrough, our concierge team is at your service.',
      address: 'Door No. 4/77/A, Happy Down,\nSalaiyar, Nandhavanapatty,\nOld Karur Road, Dindigul - 624 005.', phone1: '+91 93441 49236', phone2: '+91 93604 35871',
      email: 'concierge@vedhika.co.in', hours: 'Mon - Sat: 10:00 AM - 8:00 PM\nSunday: By Appointment Only',
      formTitle: 'Send a Message', formDesc: 'Bespoke consultations and enquiries', storeImage: ''
    };
    if (page === 'return-gifts') return { 
      heroTag: 'Bulk & Corporate Gifting', title: 'Curated Elegance For Every Guest', subtitle: 'Elevate your milestones—weddings, corporate retreats, and grand celebrations—with bespoke return gifts crafted by master artisans.', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920',
      galleryTitle: 'The Gift Gallery', gallerySubtitle: 'A Selection of our most coveted pieces',
      processTitle: 'The Experience', processSubtitle: 'Seamless from concept to unboxing',
      step1Title: 'Consultation', step1Desc: 'Discuss your event theme, guest list, and vision with our dedicated gifting concierge.',
      step2Title: 'Customization', step2Desc: 'Select products, bespoke packaging, ribbons, and personalized name tags or logos.',
      step3Title: 'Delivery', step3Desc: 'Relax as we handle the logistics, ensuring pristine, on-time delivery to your venue.',
      inquiryTitle: 'Request a Quote', inquiryDesc: 'Fill out the details below, and our gifting concierge will contact you within 24 hours.'
    };
    if (page === 'about') return {
      heroTag: 'Our Legacy', heroTitle: 'A Tradition of Excellence', heroDesc: 'Founded on the principles of timeless craftsmanship and uncompromising quality, Luxe Precision brings you curations that define heritage and sophistication.',
      img1: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200', img2: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
      quoteText: '"We don\'t just create garments; we weave stories of heritage, preserving the art of the loom for the modern connoisseur."', quoteAuthor: '— The Founders'
    };
    return {};
  };

  const handleChange = (field, value) => {
    setContentData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Optional: show some loading state specifically for image upload here if needed
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await adminService.uploadImage(formData);
      if (res.success && res.imageUrl) {
        handleChange(field, res.imageUrl);
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      saveSiteContent(activeTab, contentData);
      alert('Content updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving content.');
    }
    setSaving(false);
  };

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 lg:p-8 border border-[#333333]">
      <h2 className="text-2xl font-black text-white mb-6">Pages Content Management</h2>
      
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#333333] pb-4">
        {PAGES.map(page => (
          <button
            key={page}
            onClick={() => setActiveTab(page)}
            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === page ? 'bg-[#D4AF37] text-black' : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            {page.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-[#D4AF37]" size={32} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {activeTab === 'home' && (
            <>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 border-b border-[#333333] pb-2">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Title</label>
                  <input type="text" value={contentData.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Subtitle</label>
                  <input type="text" value={contentData.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {contentData.imageUrl && (
                    <div className="flex flex-col items-center gap-1">
                      <img src={getImageUrl(contentData.imageUrl)} alt="Hero preview" className="w-16 h-16 object-cover rounded-lg border border-[#333333]" />
                      <button type="button" onClick={() => handleChange('imageUrl', '')} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold">Remove</button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageUrl')} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white focus:border-[#D4AF37] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b5952f] cursor-pointer" />
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Brand Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Stat 1 */}
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 1 Num</label>
                  <input type="text" value={contentData.stat1Num || ''} onChange={(e) => handleChange('stat1Num', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 1 Label</label>
                  <input type="text" value={contentData.stat1Label || ''} onChange={(e) => handleChange('stat1Label', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                {/* Stat 2 */}
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 2 Num</label>
                  <input type="text" value={contentData.stat2Num || ''} onChange={(e) => handleChange('stat2Num', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 2 Label</label>
                  <input type="text" value={contentData.stat2Label || ''} onChange={(e) => handleChange('stat2Label', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                {/* Stat 3 */}
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 3 Num</label>
                  <input type="text" value={contentData.stat3Num || ''} onChange={(e) => handleChange('stat3Num', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 3 Label</label>
                  <input type="text" value={contentData.stat3Label || ''} onChange={(e) => handleChange('stat3Label', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                {/* Stat 4 */}
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 4 Num</label>
                  <input type="text" value={contentData.stat4Num || ''} onChange={(e) => handleChange('stat4Num', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Stat 4 Label</label>
                  <input type="text" value={contentData.stat4Label || ''} onChange={(e) => handleChange('stat4Label', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Lookbook Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Tagline</label>
                  <input type="text" value={contentData.editorialTag || ''} onChange={(e) => handleChange('editorialTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" value={contentData.editorialTitle || ''} onChange={(e) => handleChange('editorialTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea rows={3} value={contentData.editorialDesc || ''} onChange={(e) => handleChange('editorialDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image 1</label>
                  <div className="flex flex-col gap-2">
                    {contentData.editorialImg1 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.editorialImg1)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('editorialImg1', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'editorialImg1')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image 2</label>
                  <div className="flex flex-col gap-2">
                    {contentData.editorialImg2 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.editorialImg2)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('editorialImg2', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'editorialImg2')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image 3</label>
                  <div className="flex flex-col gap-2">
                    {contentData.editorialImg3 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.editorialImg3)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('editorialImg3', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'editorialImg3')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Atelier Experience Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Tagline</label>
                  <input type="text" value={contentData.atelierTag || ''} onChange={(e) => handleChange('atelierTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" value={contentData.atelierTitle || ''} onChange={(e) => handleChange('atelierTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea rows={3} value={contentData.atelierDesc || ''} onChange={(e) => handleChange('atelierDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Atelier Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {contentData.atelierImage && (
                    <div className="flex flex-col items-center gap-1">
                      <img src={getImageUrl(contentData.atelierImage)} alt="Atelier preview" className="w-16 h-16 object-cover rounded-lg border border-[#333333]" />
                      <button type="button" onClick={() => handleChange('atelierImage', '')} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold">Remove</button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'atelierImage')} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white focus:border-[#D4AF37] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b5952f] cursor-pointer" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'boutique' && (
            <>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 border-b border-[#333333] pb-2">Heritage Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Tagline</label>
                  <input type="text" value={contentData.heritageTag || ''} onChange={(e) => handleChange('heritageTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" value={contentData.heritageTitle || ''} onChange={(e) => handleChange('heritageTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea rows={4} value={contentData.heritageDesc || ''} onChange={(e) => handleChange('heritageDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>
              
              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Atelier Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Tagline</label>
                  <input type="text" value={contentData.atelierTag || ''} onChange={(e) => handleChange('atelierTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" value={contentData.atelierTitle || ''} onChange={(e) => handleChange('atelierTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea rows={4} value={contentData.atelierDesc || ''} onChange={(e) => handleChange('atelierDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Showroom Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Showroom 1 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Showroom 1 Text</label>
                  <input type="text" value={contentData.showroomText1 || ''} onChange={(e) => handleChange('showroomText1', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image</label>
                  <div className="flex flex-col gap-2">
                    {contentData.showroomImg1 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.showroomImg1)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('showroomImg1', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showroomImg1')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
                {/* Showroom 2 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Showroom 2 Text</label>
                  <input type="text" value={contentData.showroomText2 || ''} onChange={(e) => handleChange('showroomText2', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image</label>
                  <div className="flex flex-col gap-2">
                    {contentData.showroomImg2 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.showroomImg2)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('showroomImg2', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showroomImg2')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
                {/* Showroom 3 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Showroom 3 Text</label>
                  <input type="text" value={contentData.showroomText3 || ''} onChange={(e) => handleChange('showroomText3', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image</label>
                  <div className="flex flex-col gap-2">
                    {contentData.showroomImg3 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.showroomImg3)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('showroomImg3', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showroomImg3')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
                {/* Showroom 4 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Showroom 4 Text</label>
                  <input type="text" value={contentData.showroomText4 || ''} onChange={(e) => handleChange('showroomText4', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image</label>
                  <div className="flex flex-col gap-2">
                    {contentData.showroomImg4 && (
                      <div className="relative">
                        <img src={getImageUrl(contentData.showroomImg4)} className="w-full h-24 object-cover rounded-lg border border-[#333333]" />
                        <button type="button" onClick={() => handleChange('showroomImg4', '')} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded p-1 text-[9px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md">Remove</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'showroomImg4')} className="text-xs text-white file:bg-[#D4AF37] file:border-0 file:rounded file:px-2 file:py-1 file:text-black cursor-pointer" />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 border-b border-[#333333] pb-2">Header Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Tagline</label>
                  <input type="text" value={contentData.headerTag || ''} onChange={(e) => handleChange('headerTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" value={contentData.headerTitle || ''} onChange={(e) => handleChange('headerTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Description</label>
                <textarea rows={3} value={contentData.headerDesc || ''} onChange={(e) => handleChange('headerDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Contact Details</h3>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Address</label>
                <textarea rows={4} value={contentData.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Phone Number 1</label>
                  <input type="text" value={contentData.phone1 || ''} onChange={(e) => handleChange('phone1', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Phone Number 2 (Optional)</label>
                  <input type="text" value={contentData.phone2 || ''} onChange={(e) => handleChange('phone2', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Email</label>
                  <input type="email" value={contentData.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Store Hours</label>
                  <textarea rows={2} value={contentData.hours || ''} onChange={(e) => handleChange('hours', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Form & Store Image</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Form Title</label>
                  <input type="text" value={contentData.formTitle || ''} onChange={(e) => handleChange('formTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Form Description</label>
                  <input type="text" value={contentData.formDesc || ''} onChange={(e) => handleChange('formDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Store Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {contentData.storeImage && (
                    <div className="flex flex-col items-center gap-1">
                      <img src={getImageUrl(contentData.storeImage)} alt="Store preview" className="w-16 h-16 object-cover rounded-lg border border-[#333333]" />
                      <button type="button" onClick={() => handleChange('storeImage', '')} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold">Remove</button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'storeImage')} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white focus:border-[#D4AF37] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b5952f] cursor-pointer" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'return-gifts' && (
            <>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 border-b border-[#333333] pb-2">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Tagline</label>
                  <input type="text" value={contentData.heroTag || ''} onChange={(e) => handleChange('heroTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Title</label>
                  <input type="text" value={contentData.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Subtitle</label>
                <textarea rows={3} value={contentData.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {contentData.imageUrl && (
                    <div className="flex flex-col items-center gap-1">
                      <img src={getImageUrl(contentData.imageUrl)} alt="Hero preview" className="w-16 h-16 object-cover rounded-lg border border-[#333333]" />
                      <button type="button" onClick={() => handleChange('imageUrl', '')} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold">Remove</button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageUrl')} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white focus:border-[#D4AF37] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-[#b5952f] cursor-pointer" />
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Gallery Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Gallery Title</label>
                  <input type="text" value={contentData.galleryTitle || ''} onChange={(e) => handleChange('galleryTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Gallery Subtitle</label>
                  <input type="text" value={contentData.gallerySubtitle || ''} onChange={(e) => handleChange('gallerySubtitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">The Experience Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Process Title</label>
                  <input type="text" value={contentData.processTitle || ''} onChange={(e) => handleChange('processTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Process Subtitle</label>
                  <input type="text" value={contentData.processSubtitle || ''} onChange={(e) => handleChange('processSubtitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Step 1 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Step 1 Title</label>
                  <input type="text" value={contentData.step1Title || ''} onChange={(e) => handleChange('step1Title', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Step 1 Description</label>
                  <textarea rows={3} value={contentData.step1Desc || ''} onChange={(e) => handleChange('step1Desc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                {/* Step 2 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Step 2 Title</label>
                  <input type="text" value={contentData.step2Title || ''} onChange={(e) => handleChange('step2Title', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Step 2 Description</label>
                  <textarea rows={3} value={contentData.step2Desc || ''} onChange={(e) => handleChange('step2Desc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                {/* Step 3 */}
                <div className="p-4 border border-[#333333] rounded-xl bg-[#0a0a0a]">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Step 3 Title</label>
                  <input type="text" value={contentData.step3Title || ''} onChange={(e) => handleChange('step3Title', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:border-[#D4AF37] focus:outline-none" required />
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Step 3 Description</label>
                  <textarea rows={3} value={contentData.step3Desc || ''} onChange={(e) => handleChange('step3Desc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>

              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 mt-8 border-b border-[#333333] pb-2">Inquiry Form Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Inquiry Title</label>
                  <input type="text" value={contentData.inquiryTitle || ''} onChange={(e) => handleChange('inquiryTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Inquiry Description</label>
                  <input type="text" value={contentData.inquiryDesc || ''} onChange={(e) => handleChange('inquiryDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-2 text-white text-sm focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>
            </>
          )}

          {activeTab === 'about' && (
            <>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-2 border-b border-[#333333] pb-2">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Tag</label>
                  <input type="text" value={contentData.heroTag || ''} onChange={(e) => handleChange('heroTag', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Title</label>
                  <input type="text" value={contentData.heroTitle || ''} onChange={(e) => handleChange('heroTitle', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Hero Description</label>
                  <textarea rows="3" value={contentData.heroDesc || ''} onChange={(e) => handleChange('heroDesc', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                </div>
              </div>

              <div className="pt-4 border-t border-[#333333] mt-8">
                <h3 className="text-[#D4AF37] font-bold text-lg mb-2 border-b border-[#333333] pb-2">Gallery Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image 1 (Landscape)</label>
                    <div className="flex items-center gap-4">
                      {contentData.img1 && (
                        <img src={getImageUrl(contentData.img1)} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[#333333]" />
                      )}
                      <input type="file" onChange={(e) => handleImageUpload(e, 'img1')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#333] file:text-white hover:file:bg-[#444]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Image 2 (Portrait)</label>
                    <div className="flex items-center gap-4">
                      {contentData.img2 && (
                        <img src={getImageUrl(contentData.img2)} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[#333333]" />
                      )}
                      <input type="file" onChange={(e) => handleImageUpload(e, 'img2')} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#333] file:text-white hover:file:bg-[#444]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#333333] mt-8">
                <h3 className="text-[#D4AF37] font-bold text-lg mb-2">Philosophy Quote</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Quote Text</label>
                    <textarea rows="3" value={contentData.quoteText || ''} onChange={(e) => handleChange('quoteText', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Quote Author</label>
                    <input type="text" value={contentData.quoteAuthor || ''} onChange={(e) => handleChange('quoteAuthor', e.target.value)} className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none" required />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#b5952f] transition-colors"
            >
              {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
