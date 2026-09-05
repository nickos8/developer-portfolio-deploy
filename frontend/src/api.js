import axios from 'axios'

// VITE_API_URL lets a separate-origin setup point at the backend explicitly.
// Without it: in dev, the frontend runs on its own Vite server so it needs
// the local Laravel URL; in a production build it's served combined-origin
// by Laravel itself (see DEPLOYMENT.md), so an empty/relative base URL
// correctly targets that same origin.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '')

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Build a full URL to a file stored on the backend's public disk
 * (for example a project's image_path) so it can be used in an <img> src.
 */
export function resolveStorageUrl(path) {
  if (!path) {
    return null
  }

  return `${API_BASE_URL}/storage/${path}`
}

/**
 * Extract a readable message from a failed API call, falling back to a
 * generic message when the response has no useful text of its own.
 */
export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error.response?.data?.message || fallback
}

export default api
