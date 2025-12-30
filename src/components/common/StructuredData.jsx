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
          url: 'https://ananaydubey.com',
          sameAs: [
            'https://linkedin.com/in/ananaydubey',
            'https://github.com/ananaydubey',
            'https://twitter.com/ananaydubey'
          ],
          knowsAbout: ['React', 'JavaScript', 'Python', 'Machine Learning', 'Web Development'],
          alumniOf: {
            '@type': 'Organization',
            name: 'Your University'
          },
          ...data
        }

      case 'WebSite':
        return {
          ...baseData,
          name: 'Ananay Dubey - Portfolio',
          url: 'https://ananaydubey.com',
          description: 'Full Stack Developer specializing in React, Python, and Machine Learning',
          author: {
            '@type': 'Person',
            name: 'Ananay Dubey'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://ananaydubey.com/search?q={search_term_string}',
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
          url: 'https://ananaydubey.com',
          ...data
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