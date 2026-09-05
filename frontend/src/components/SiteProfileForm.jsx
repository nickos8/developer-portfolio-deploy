import { useState } from 'react'
import api, { apiErrorMessage } from '../api'
import { useSiteProfile } from '../context/useSiteProfile'
import LoadingState from './states/LoadingState'

function toFormState(profile) {
  return {
    name: profile.name || '',
    role: profile.role || '',
    tagline: profile.tagline || '',
    location: profile.location || '',
    email: profile.email || '',
    resumeUrl: profile.resumeUrl || '',
    aboutText: (profile.about || []).join('\n\n'),
    skillsText: (profile.skills || [])
      .map((group) => `${group.category}: ${(group.items || []).join(', ')}`)
      .join('\n'),
    socialLinksText: (profile.socialLinks || [])
      .map((link) => `${link.label}: ${link.url}`)
      .join('\n'),
  }
}

// Splits "Label: value" style lines into { label, value }, splitting on
// only the first colon so URLs (which contain their own colons) survive.
function parseLabelledLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':')
      const label = separatorIndex === -1 ? line : line.slice(0, separatorIndex).trim()
      const rest = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1).trim()
      return { label, rest }
    })
}

function buildPayload(fields) {
  return {
    name: fields.name,
    role: fields.role,
    tagline: fields.tagline,
    location: fields.location || null,
    email: fields.email || null,
    resume_url: fields.resumeUrl || null,
    about: fields.aboutText
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    skills: parseLabelledLines(fields.skillsText).map(({ label, rest }) => ({
      category: label,
      items: rest
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    })),
    social_links: parseLabelledLines(fields.socialLinksText).map(({ label, rest }) => ({
      label,
      url: rest,
    })),
  }
}

function fieldErrorsFor(errors, prefix) {
  return Object.entries(errors)
    .filter(([key]) => key === prefix || key.startsWith(`${prefix}.`))
    .map(([, messages]) => messages[0])
}

// Renders nothing until the profile has finished loading, then mounts
// the actual form fresh -- so its local state can simply snapshot the
// profile once, at mount, with no effect needed to "catch up" later.
export default function SiteProfileForm() {
  const { isLoading } = useSiteProfile()

  if (isLoading) {
    return <LoadingState label="Loading your current profile..." />
  }

  return <SiteProfileFormFields />
}

function SiteProfileFormFields() {
  const { profile, setProfileFromApi } = useSiteProfile()

  // Snapshotted once, at mount. A viewer editing this form shouldn't
  // have it silently overwritten -- including by our own successful
  // save, which updates the shared profile via setProfileFromApi.
  const [fields, setFields] = useState(() => toFormState(profile))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [avatarFile, setAvatarFile] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  async function handleAvatarUpload(event) {
    event.preventDefault()

    if (!avatarFile) {
      return
    }

    setIsUploadingAvatar(true)
    setAvatarError('')

    const formData = new FormData()
    formData.append('avatar', avatarFile)

    try {
      const response = await api.post('/api/site-profile/avatar', formData)
      setProfileFromApi(response.data)
      setAvatarFile(null)
    } catch (error) {
      setAvatarError(apiErrorMessage(error, 'Failed to upload the photo.'))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  function updateField(name, value) {
    setFields((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setErrors({})
    setFormError('')
    setSuccessMessage('')

    try {
      const response = await api.put('/api/site-profile', buildPayload(fields))
      setProfileFromApi(response.data)
      setSuccessMessage('Profile updated -- your public site reflects this now.')
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } else {
        setFormError(apiErrorMessage(error, 'Failed to save your profile.'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const aboutErrors = fieldErrorsFor(errors, 'about')
  const skillsErrors = fieldErrorsFor(errors, 'skills')
  const socialErrors = fieldErrorsFor(errors, 'social_links')

  return (
    <div className="project-form-wrapper">
      <div className="image-upload">
        <h4>Profile photo</h4>

        {profile.avatarUrl && <img src={profile.avatarUrl} alt="" className="hero-avatar" />}

        <form onSubmit={handleAvatarUpload} className="form-row">
          <input
            type="file"
            accept="image/*"
            aria-label="Profile photo file"
            onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
          />
          <button type="submit" className="button" disabled={!avatarFile || isUploadingAvatar}>
            {isUploadingAvatar ? 'Uploading...' : 'Upload photo'}
          </button>
        </form>

        {avatarError && (
          <p className="form-error" role="alert">
            {avatarError}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            value={fields.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
          {errors.name && <p className="form-error">{errors.name[0]}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="profile-role">Role</label>
          <input
            id="profile-role"
            value={fields.role}
            onChange={(event) => updateField('role', event.target.value)}
            placeholder="Junior Web Developer"
            required
          />
          {errors.role && <p className="form-error">{errors.role[0]}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="profile-tagline">Tagline</label>
        <textarea
          id="profile-tagline"
          rows={2}
          value={fields.tagline}
          onChange={(event) => updateField('tagline', event.target.value)}
          required
        />
        <p className="form-hint">The one-line summary shown under your name in the hero section.</p>
        {errors.tagline && <p className="form-error">{errors.tagline[0]}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="profile-location">Location</label>
          <input
            id="profile-location"
            value={fields.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Cebu, Philippines"
          />
          {errors.location && <p className="form-error">{errors.location[0]}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="profile-email">Contact email</label>
          <input
            id="profile-email"
            type="email"
            value={fields.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="form-error">{errors.email[0]}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="profile-resume">Resume link</label>
          <input
            id="profile-resume"
            value={fields.resumeUrl}
            onChange={(event) => updateField('resumeUrl', event.target.value)}
            placeholder="/resume.pdf"
          />
          {errors.resume_url && <p className="form-error">{errors.resume_url[0]}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="profile-about">About</label>
        <textarea
          id="profile-about"
          rows={6}
          value={fields.aboutText}
          onChange={(event) => updateField('aboutText', event.target.value)}
          required
        />
        <p className="form-hint">Leave a blank line between paragraphs.</p>
        {aboutErrors.map((message) => (
          <p className="form-error" key={message}>
            {message}
          </p>
        ))}
      </div>

      <div className="form-field">
        <label htmlFor="profile-skills">Skills</label>
        <textarea
          id="profile-skills"
          rows={4}
          value={fields.skillsText}
          onChange={(event) => updateField('skillsText', event.target.value)}
          required
        />
        <p className="form-hint">
          One category per line: <code className="inline">Category: skill one, skill two, skill three</code>
        </p>
        {skillsErrors.map((message) => (
          <p className="form-error" key={message}>
            {message}
          </p>
        ))}
      </div>

      <div className="form-field">
        <label htmlFor="profile-social">Social links</label>
        <textarea
          id="profile-social"
          rows={3}
          value={fields.socialLinksText}
          onChange={(event) => updateField('socialLinksText', event.target.value)}
        />
        <p className="form-hint">
          One per line: <code className="inline">GitHub: https://github.com/you</code>
        </p>
        {socialErrors.map((message) => (
          <p className="form-error" key={message}>
            {message}
          </p>
        ))}
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save profile'}
        </button>
      </div>
      </form>
    </div>
  )
}
