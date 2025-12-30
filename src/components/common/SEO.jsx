import { Helmet } from 'react-helmet-async'
import StructuredData from './StructuredData'

function SEO({ 
  title = "Ananay Dubey | Full-Stack Developer & React Specialist",
  description = "Full-Stack Web Developer specializing in React, TypeScript, Next.js, and AI-powered applications. Building digital experiences that matter. View my portfolio of 15+ projects.",
  image = "https://ananay.netlify.app/assets/images/og-image.png",
  url = "https://ananay.netlify.app",
  type = "website",
  structuredData = null
}) {
  const siteName = "Ananay Dubey Portfolio"
  const twitterHandle = "@ananaydubey"

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="author" content="Ananay Dubey" />
        <meta name="keywords" content="Ananay Dubey, Full Stack Developer, React Developer, Web Developer, Portfolio, TypeScript, Next.js, JavaScript, AI, Machine Learning, PEC Chandigarh" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterHandle} />
        <meta name="twitter:creator" content={twitterHandle} />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={url} />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#5227FF" />
        <meta name="msapplication-TileColor" content="#5227FF" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </Helmet>
      
      {/* Structured Data */}
      <StructuredData type="Person" />
      <StructuredData type="WebSite" />
      {structuredData && <StructuredData {...structuredData} />}
    </>
  )
}

export default SEO