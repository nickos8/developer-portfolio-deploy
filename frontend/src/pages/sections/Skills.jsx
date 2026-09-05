import { site } from '../../data/site'

export default function Skills() {
  return (
    <section id="skills" className="section section-alt" aria-labelledby="skills-heading">
      <div className="container">
        <h2 id="skills-heading">Skills</h2>

        <div className="skills-grid">
          {site.skills.map((group) => (
            <div key={group.category} className="skills-group">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
