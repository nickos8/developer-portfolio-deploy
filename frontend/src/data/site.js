// -----------------------------------------------------------------------
// Site content
// -----------------------------------------------------------------------
// Everything in this file is placeholder text so the site is complete and
// deployable out of the box. Edit the values below with your own details
// -- nothing else in the app needs to change to personalize the site.
// -----------------------------------------------------------------------

export const site = {
  name: 'Your Name', // TODO: replace with your name
  role: 'Junior Web Developer',
  tagline:
    'I build full-stack web applications with Laravel, React, and PostgreSQL.',
  location: 'Your City, Country', // TODO
  email: 'you@example.com', // TODO
  // Points at frontend/public/resume.pdf. Replace that file with your own
  // resume -- BASE_URL keeps the link correct in both local dev and the
  // production build served from Laravel's /app path.
  resumeUrl: `${import.meta.env.BASE_URL}resume.pdf`,

  about: [
    "Replace this paragraph with a short introduction: who you are, what " +
      "you studied, and what kind of developer role you're looking for.",
    'A second short paragraph works well here too -- what you enjoy ' +
      'building, or what you learned putting this portfolio together.',
  ],

  skills: [
    {
      category: 'Languages',
      items: ['PHP', 'JavaScript', 'HTML', 'CSS', 'SQL'],
    },
    {
      category: 'Frameworks & Libraries',
      items: ['Laravel', 'React', 'Vite'],
    },
    {
      category: 'Tools & Platforms',
      items: ['Git & GitHub', 'PostgreSQL', 'Supabase', 'REST APIs'],
    },
  ],

  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/nickos8' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' }, // TODO
  ],
}
