import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="container">
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="button button-primary">
          Back home
        </Link>
      </div>
    </main>
  )
}
