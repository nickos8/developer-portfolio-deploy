import { Link } from 'react-router-dom'
import { site } from '../data/site'

export default function Footer() {
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
