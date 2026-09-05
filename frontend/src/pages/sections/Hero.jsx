import { useSiteProfile } from '../../context/useSiteProfile'

export default function Hero() {
  const { profile: site } = useSiteProfile()

  return (
    <section className="hero" aria-label="Introduction">
      <div className="container hero-inner">
        {site.avatarUrl && <img className="hero-avatar" src={site.avatarUrl} alt={site.name} />}
        <p className="eyebrow">{site.role}</p>
        <h1>{site.name}</h1>
        <p className="hero-tagline">{site.tagline}</p>

        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            View projects
          </a>
          <a className="button" href="#contact">
            Contact me
          </a>
          <a className="button" href={site.resumeUrl} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>
    </section>
  )
}
