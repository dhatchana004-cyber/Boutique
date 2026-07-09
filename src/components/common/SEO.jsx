import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, type = 'website', image = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200' }) {
  const siteTitle = title ? `${title} | Luxe Precision` : 'Luxe Precision | The Heritage Boutique';
  const siteDescription = description || 'Experience bespoke luxury craftsmanship and exquisite silhouettes hand-embroidered for your most memorable moments.';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
