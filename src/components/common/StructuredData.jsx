import { Helmet } from 'react-helmet-async'

function StructuredData({ type = 'Person', data = {} }) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type
    }

    switch (type) {
      case 'Person':
        return {
          ...baseData,
          name: 'Ananay Dubey',
          jobTitle: 'Full Stack Developer',
          url: 'https://ananay.netlify.app',
          sameAs: [
            'https://linkedin.com/in/ananaydubey',
            'https://github.com/FTS18',
            'https://youtube.com/@spacify18',
            'https://instagram.com/ananay_dubey',
            'https://twitter.com/ananaydubey'
          ],
          knowsAbout: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Python', 'Machine Learning', 'Web Development'],
          alumniOf: {
            '@type': 'Organization',
            name: 'PEC Chandigarh'
          },
          ...data
        }

      case 'WebSite':
        return {
          ...baseData,
          name: 'Ananay Dubey - Portfolio',
          url: 'https://ananay.netlify.app',
          description: 'Full Stack Developer specializing in React, Python, and Machine Learning',
          author: {
            '@type': 'Person',
            name: 'Ananay Dubey'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://ananay.netlify.app/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          },
          ...data
        }

      case 'Portfolio':
        return {
          ...baseData,
          '@type': 'CreativeWork',
          name: 'Ananay Dubey Portfolio',
          creator: {
            '@type': 'Person',
            name: 'Ananay Dubey'
          },
          description: 'A collection of web development and machine learning projects',
          url: 'https://ananay.netlify.app',
          ...data
        }

      case 'ItemList':
        return {
          ...baseData,
          name: 'Projects',
          description: 'Featured projects by Ananay Dubey',
          itemListElement: (data.items || []).map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'SoftwareApplication',
              name: item.title,
              description: item.shortDesc,
              applicationCategory: 'WebApplication',
              operatingSystem: 'Any',
              url: item.link.startsWith('http') ? item.link : `https://ananay.netlify.app${item.link}`
            }
          }))
        }

      default:
        return { ...baseData, ...data }
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  )
}

export default StructuredData