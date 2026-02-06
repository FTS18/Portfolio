import { lazy, Suspense } from 'react'
import { useOutletContext } from 'react-router-dom'
import HeroSection from '../components/Home/HeroSection'
import PersonalSection from '../components/Home/PersonalSection'
import LazySection from '../components/common/LazySection'
import SEO from '../components/common/SEO'

// Lazy load sections
const ConnectSection = lazy(() => import('../components/Home/ConnectSection'))
const ProjectsSection = lazy(() => import('../components/Projects/ProjectsSection'))
const ExperienceSection = lazy(() => import('../components/Home/ExperienceSection'))
const DSASection = lazy(() => import('../components/Home/DSASection'))
const SkillsSection = lazy(() => import('../components/Home/SkillsSection'))
const GuestbookSection = lazy(() => import('../components/Home/GuestbookSection'))
const ContactFormSection = lazy(() => import('../components/Home/ContactFormSection'))

const SectionLoader = () => (
  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="section-loading-shimmer" style={{ width: '80%', height: '100px', opacity: 0.1, background: 'var(--text-color)', borderRadius: '12px' }} />
  </div>
)

function Home() {
  const { isLoaderComplete, canvasEnabled = true } = useOutletContext()
  
  return (
    <>
      <SEO 
        title="Ananay Dubey | Full-Stack Developer & React Specialist"
        description="Full-Stack Web Developer specializing in React, TypeScript, and AI-powered applications. View my portfolio of 15+ projects including hackathon-winning apps."
        image="https://ananay.netlify.app/assets/images/og-image.png"
        url="https://ananay.netlify.app"
      />
      <HeroSection isLoaderComplete={isLoaderComplete} canvasEnabled={canvasEnabled} />
      <PersonalSection />
      
      {/* Lazy load sections below the fold */}
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <ConnectSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <DSASection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <ExperienceSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <SkillsSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <GuestbookSection />
        </Suspense>
      </LazySection>
      
      <LazySection rootMargin="100px">
        <Suspense fallback={<SectionLoader />}>
          <ContactFormSection />
        </Suspense>
      </LazySection>
    </>
  )
}

export default Home

