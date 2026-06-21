import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About NHSM' },
  { href: '/resources', label: 'Resources' },
  { href: '/specialties', label: 'Specialties' },
  { href: '/contact', label: 'Contribute' },
];

const EXTERNAL_LINKS = [
  { href: 'https://nhsm.dz/', label: 'NHSM Official Site' },
  { href: 'https://internationalmathematicsmaster.org/program-overview/algeria/', label: 'IMM Programme' },
];

export default function Footer() {
  return (
    <footer
      className="w-full mt-auto"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(11,15,25,0.95)',
      }}
    >
      {/* Top gradient line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(168,85,247,0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{
                  width: 16,
                  height: 16,
                  transform: 'rotate(45deg)',
                  background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                  boxShadow: '0 0 10px rgba(0,212,255,0.4)',
                  flexShrink: 0,
                }}
              />
              <span className="font-bold text-foreground tracking-wide">
                NHSMers <span style={{ color: '#00d4ff' }}>Repo</span>
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
              The student-built knowledge hub for the National Higher School of Mathematics, Algiers.
            </p>
            <p className="text-gray-700 text-xs mt-4">
              © {new Date().getFullYear()} NHSMers Repository
            </p>
          </div>

          {/* Column 2 — Site Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">Navigation</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--text-muted)] hover:text-foreground transition-colors"
                    style={{ textDecoration: 'none' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — External Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">External</h4>
            <ul className="space-y-2">
              {EXTERNAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-muted)] hover:text-foreground transition-colors flex items-center gap-1.5"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{label}</span>
                    <span className="text-[var(--text-muted)] text-xs">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs text-[var(--text-muted)]">
                Built by students, for students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
