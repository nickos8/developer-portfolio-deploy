import { site } from '../../data/site'

export default function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <h2 id="contact-heading">Contact</h2>
        <p>
          Best way to reach me:{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        {site.socialLinks.length > 0 && (
          <ul className="social-links">
            {site.socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
