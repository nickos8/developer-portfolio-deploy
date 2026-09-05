import { useCallback, useEffect, useState } from 'react'
import api, { resolveStorageUrl } from '../api'
import { site as fallbackProfile } from '../data/site'
import { SiteProfileContext } from './site-profile-context'

/**
 * Maps the API's snake_case shape onto the same shape data/site.js
 * already uses, so components don't care whether they're reading the
 * static fallback or the live, admin-edited profile.
 */
function normalizeProfile(apiProfile) {
  return {
    name: apiProfile.name,
    role: apiProfile.role,
    tagline: apiProfile.tagline,
    location: apiProfile.location,
    email: apiProfile.email,
    resumeUrl: apiProfile.resume_url || fallbackProfile.resumeUrl,
    avatarUrl: resolveStorageUrl(apiProfile.avatar_path),
    about: apiProfile.about,
    skills: apiProfile.skills,
    socialLinks: apiProfile.social_links,
  }
}

export function SiteProfileProvider({ children }) {
  // Show the static placeholder immediately so the page is never
  // blank, then silently swap in the live, admin-edited content once
  // it arrives. If the API is unreachable, the fallback just stays.
  const [profile, setProfile] = useState(fallbackProfile)
  const [isLoading, setIsLoading] = useState(true)

  const setProfileFromApi = useCallback((apiProfile) => {
    setProfile(normalizeProfile(apiProfile))
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      try {
        const response = await api.get('/api/site-profile')
        if (!ignore) setProfileFromApi(response.data)
      } catch {
        // Keep the static fallback -- a visitor should never see a
        // broken page just because the API is briefly unreachable.
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      ignore = true
    }
  }, [setProfileFromApi])

  const value = { profile, isLoading, setProfileFromApi }

  return <SiteProfileContext.Provider value={value}>{children}</SiteProfileContext.Provider>
}
