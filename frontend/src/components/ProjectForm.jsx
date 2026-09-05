import { useState } from 'react'
import api, { apiErrorMessage, resolveStorageUrl } from '../api'

function toFormState(project) {
  return {
    title: project?.title ?? '',
    short_description: project?.short_description ?? '',
    description: project?.description ?? '',
    tech_stack: project?.tech_stack?.join(', ') ?? '',
    github_url: project?.github_url ?? '',
    live_url: project?.live_url ?? '',
    is_featured: project?.is_featured ?? false,
    is_published: project?.is_published ?? false,
    display_order: project?.display_order ?? 0,
  }
}

export default function ProjectForm({ project, onSaved, onCancel }) {
  const isEditing = Boolean(project?.id)

  const [fields, setFields] = useState(() => toFormState(project))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageError, setImageError] = useState('')

  function updateField(name, value) {
    setFields((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setErrors({})
    setFormError('')

    const payload = {
      title: fields.title,
      short_description: fields.short_description,
      description: fields.description,
      tech_stack: fields.tech_stack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      github_url: fields.github_url || null,
      live_url: fields.live_url || null,
      is_featured: fields.is_featured,
      is_published: fields.is_published,
      display_order: Number(fields.display_order) || 0,
    }

    try {
      const response = isEditing
        ? await api.put(`/api/projects/${project.id}`, payload)
        : await api.post('/api/projects', payload)

      onSaved(response.data)
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } else {
        setFormError(apiErrorMessage(error, 'Failed to save the project.'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleImageUpload(event) {
    event.preventDefault()

    if (!imageFile) {
      return
    }

    setIsUploadingImage(true)
    setImageError('')

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await api.post(`/api/projects/${project.id}/image`, formData)
      setImageFile(null)
      onSaved(response.data)
    } catch (error) {
      setImageError(apiErrorMessage(error, 'Failed to upload the image.'))
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <div className="project-form-wrapper">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={fields.title}
            onChange={(event) => updateField('title', event.target.value)}
            required
          />
          {errors.title && <p className="form-error">{errors.title[0]}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="short_description">Short description</label>
          <textarea
            id="short_description"
            rows={2}
            maxLength={300}
            value={fields.short_description}
            onChange={(event) => updateField('short_description', event.target.value)}
            required
          />
          {errors.short_description && (
            <p className="form-error">{errors.short_description[0]}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="description">Full description</label>
          <textarea
            id="description"
            rows={5}
            value={fields.description}
            onChange={(event) => updateField('description', event.target.value)}
            required
          />
          {errors.description && <p className="form-error">{errors.description[0]}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="tech_stack">Technologies</label>
          <input
            id="tech_stack"
            value={fields.tech_stack}
            onChange={(event) => updateField('tech_stack', event.target.value)}
            placeholder="Laravel, React, PostgreSQL"
            required
          />
          <p className="form-hint">Separate each technology with a comma.</p>
          {(errors.tech_stack || errors['tech_stack.0']) && (
            <p className="form-error">
              {(errors.tech_stack || errors['tech_stack.0'])[0]}
            </p>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="github_url">GitHub URL</label>
            <input
              id="github_url"
              type="url"
              value={fields.github_url}
              onChange={(event) => updateField('github_url', event.target.value)}
              placeholder="https://github.com/you/project"
            />
            {errors.github_url && <p className="form-error">{errors.github_url[0]}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="live_url">Live URL</label>
            <input
              id="live_url"
              type="url"
              value={fields.live_url}
              onChange={(event) => updateField('live_url', event.target.value)}
              placeholder="https://your-project.example.com"
            />
            {errors.live_url && <p className="form-error">{errors.live_url[0]}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field form-field-inline">
            <input
              id="is_featured"
              type="checkbox"
              checked={fields.is_featured}
              onChange={(event) => updateField('is_featured', event.target.checked)}
            />
            <label htmlFor="is_featured">Featured</label>
          </div>

          <div className="form-field form-field-inline">
            <input
              id="is_published"
              type="checkbox"
              checked={fields.is_published}
              onChange={(event) => updateField('is_published', event.target.checked)}
            />
            <label htmlFor="is_published">Published</label>
          </div>

          <div className="form-field">
            <label htmlFor="display_order">Display order</label>
            <input
              id="display_order"
              type="number"
              min={0}
              value={fields.display_order}
              onChange={(event) => updateField('display_order', event.target.value)}
            />
            {errors.display_order && <p className="form-error">{errors.display_order[0]}</p>}
          </div>
        </div>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create project'}
          </button>
          {onCancel && (
            <button type="button" className="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {isEditing && (
        <div className="image-upload">
          <h4>Cover image</h4>

          {project.image_path && (
            <img
              src={resolveStorageUrl(project.image_path)}
              alt=""
              className="image-upload-preview"
            />
          )}

          <form onSubmit={handleImageUpload} className="form-row">
            <input
              type="file"
              accept="image/*"
              aria-label="Cover image file"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
            <button type="submit" className="button" disabled={!imageFile || isUploadingImage}>
              {isUploadingImage ? 'Uploading...' : 'Upload image'}
            </button>
          </form>

          {imageError && (
            <p className="form-error" role="alert">
              {imageError}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
