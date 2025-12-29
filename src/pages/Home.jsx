import { useOutletContext } from 'react-router-dom'
import HeroSection from '../components/Home/HeroSection'
import PersonalSection from '../components/Home/PersonalSection'
import SkillsSection from '../components/Home/SkillsSection'
import ConnectSection from '../components/Home/ConnectSection'
import ProjectsSection from '../components/Projects/ProjectsSection'
// import TimelineSection from '../components/Home/TimelineSection'
import ContactFormSection from '../components/Home/ContactFormSection'
import SEO from '../components/common/SEO'

function Home() {
  const { isLoaderComplete } = useOutletContext()
  
  return (
    <>
      <SEO />
      <HeroSection isLoaderComplete={isLoaderComplete} />
      <PersonalSection />
      <ConnectSection />
      <ProjectsSection />
      {/* <TimelineSection /> */}
      <SkillsSection />
      <ContactFormSection />
    </>
  )
}

export default Home
