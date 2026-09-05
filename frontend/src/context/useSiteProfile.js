import { useContext } from 'react'
import { SiteProfileContext } from './site-profile-context'

export function useSiteProfile() {
  const context = useContext(SiteProfileContext)

  if (!context) {
    throw new Error('useSiteProfile must be used within a SiteProfileProvider')
  }

  return context
}
