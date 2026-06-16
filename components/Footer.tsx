'use client'

import { useLocale } from '@/contexts/LocaleContext'

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/a.cdiaz/',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/af-diaz/',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Vimeo',
    href: 'https://vimeo.com/user238134838?fl=pp&fe=sh',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 8.5c-.1 2.6-1.9 6.1-5.5 10.5C13 23.5 10 25 7.5 24c-1.5-.6-2.7-2.3-3.4-5L2.5 12C2 10 1.4 9 .8 9.2" />
        <path d="M.8 9.2C2 8.1 3.3 7.7 4.5 8.5c1 .7 1.6 2.1 2 4l.8 2.5" />
        <path d="M7.3 15c.4.8.9 1 1.3 1 .5 0 1.1-.5 1.9-1.6C11.4 13 12 11.8 12 11c0-1.1-.6-1.6-1.7-1.6-.6 0-1.3.2-2 .6" />
        <path d="M8.2 9.6C9.3 6.6 11.2 5.2 14 5.4c1.9.2 2.8 1.4 2.5 3.6-.1 1.1-.8 2.6-2 4.4" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@callmegrett',
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer
      className="flex flex-col gap-6 px-6 md:px-10 py-10 border-t border-white/5"
      role="contentinfo"
    >
      <nav aria-label="Social links" className="flex flex-wrap gap-6 md:gap-8">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted hover:text-accent transition-colors duration-300"
          >
            {/* Mobile: icon only */}
            <span className="md:hidden flex items-center justify-center w-8 h-8">
              <Icon />
            </span>
            {/* Desktop: text label */}
            <span className="hidden md:inline font-mono text-[14px] tracking-[0.15em] uppercase">
              {label}
            </span>
          </a>
        ))}
      </nav>
      <span className="font-mono text-[14px] tracking-[0.15em] uppercase text-muted">
        {t.footer.copyright.replace('{year}', String(year))}
      </span>
    </footer>
  )
}
