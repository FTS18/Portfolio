import { useOutletContext } from 'react-router-dom'
import HeroSection from '../components/Home/HeroSection'
import PersonalSection from '../components/Home/PersonalSection'
import SkillsSection from '../components/Home/SkillsSection'
import ConnectSection from '../components/Home/ConnectSection'
import ProjectsSection from '../components/Projects/ProjectsSection'
import ContactFormSection from '../components/Home/ContactFormSection'
import GuestbookSection from '../components/Home/GuestbookSection'
import LazySection from '../components/common/LazySection'
import SEO from '../components/common/SEO'

function Home() {
  const { isLoaderComplete } = useOutletContext()
  
  return (
    <>
      <SEO 
        title="Ananay Dubey | Full-Stack Developer & React Specialist"
        description="Full-Stack Web Developer specializing in React, TypeScript, and AI-powered applications. View my portfolio of 15+ projects including hackathon-winning apps."
        image="https://ananay.netlify.app/assets/images/og-image.png"
        url="https://ananay.netlify.app"
      />
      <HeroSection isLoaderComplete={isLoaderComplete} />
      <PersonalSection />
      
      {/* Lazy load sections below the fold */}
      <LazySection rootMargin="100px">
        <ConnectSection />
      </LazySection>
      
      <LazySection rootMargin="100px">
        <ProjectsSection />
      </LazySection>
      
      <LazySection rootMargin="100px">
        <SkillsSection />
      </LazySection>
      
      <LazySection rootMargin="100px">
        <GuestbookSection />
      </LazySection>
      
      <LazySection rootMargin="100px">
        <ContactFormSection />
      </LazySection>
    </>
  )
}

export default Home

