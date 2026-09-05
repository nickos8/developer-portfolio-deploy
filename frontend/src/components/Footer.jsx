import { Link } from 'react-router-dom'
import { useSiteProfile } from '../context/useSiteProfile'

export default function Footer() {
  const { profile: site } = useSiteProfile()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <Link to="/admin/login" className="footer-admin-link">
          Admin
        </Link>
      </div>
    </footer>
  )
}
