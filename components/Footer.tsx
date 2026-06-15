const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/a.cdiaz/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/af-diaz/' },
  { label: 'Vimeo', href: 'https://vimeo.com/user238134838?fl=pp&fe=sh' },
  { label: 'YouTube', href: 'https://www.youtube.com/@callmegrett' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="flex flex-col gap-6 px-6 md:px-10 py-10 border-t border-white/5"
      role="contentinfo"
    >
      <nav aria-label="Social links" className="flex flex-wrap gap-6 md:gap-8">
        {socials.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[14px] tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors duration-300"
          >
            {label}
          </a>
        ))}
      </nav>
      <span className="font-mono text-[14px] tracking-[0.15em] uppercase text-muted">
        &copy; {year} Andres Díaz. All rights reserved.
      </span>
    </footer>
  )
}
