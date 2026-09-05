import { Link } from 'react-router-dom'
import { useSiteProfile } from '../context/useSiteProfile'

export default function Navbar() {
  const { profile: site } = useSiteProfile()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          {site.name}
        </Link>

        <nav aria-label="Primary">
          <ul className="navbar-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
