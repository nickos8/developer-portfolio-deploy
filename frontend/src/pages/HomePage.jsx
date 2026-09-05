import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import ProjectsSection from './sections/ProjectsSection'
import Contact from './sections/Contact'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <ProjectsSection />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
