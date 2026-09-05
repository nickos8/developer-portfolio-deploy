import { site } from '../../data/site'

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <h2 id="about-heading">About</h2>

        {site.about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="about-paragraph">
            {paragraph}
          </p>
        ))}

        <p className="about-meta">{site.location}</p>
      </div>
    </section>
  )
}
