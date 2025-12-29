import HeroSection from '../components/Home/HeroSection'
import PersonalSection from '../components/Home/PersonalSection'
import SkillsSection from '../components/Home/SkillsSection'
import ConnectSection from '../components/Home/ConnectSection'
import ProjectsSection from '../components/Projects/ProjectsSection'
import ContactSection from '../components/Home/ContactSection'
import SEO from '../components/common/SEO'

function Home() {
  return (
    <>
      <SEO />
      <HeroSection />
      <PersonalSection />
      <SkillsSection />
      <ConnectSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}

export default Home
