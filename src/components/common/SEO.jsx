import { Helmet } from 'react-helmet-async'

function SEO({ 
  title = "Ananay | Portfolio",
  description = "A dedicated student with proficiency in HTML, Python, CSS & JavaScript, actively participating in diverse projects and coding competitions.",
  image = "https://ananay.netlify.app/assets/images/ss.png",
  url = "https://ananay.netlify.app"
}) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  )
}

export default SEO
