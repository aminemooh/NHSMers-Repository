'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/specialties', label: 'Specialties' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-40 w-full"
      style={{
        background: scrolled
          ? 'rgba(11, 15, 25, 0.85)'
          : 'rgba(11, 15, 25, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          style={{ textDecoration: 'none' }}
        >
          {/* Mini diamond logo */}
          <div
            style={{
              width: 20,
              height: 20,
              transform: 'rotate(45deg)',
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              boxShadow: '0 0 12px rgba(0,212,255,0.5)',
              transition: 'box-shadow 0.4s ease',
              flexShrink: 0,
            }}
            className="group-hover:[box-shadow:0_0_20px_rgba(0,212,255,0.8)]"
          />
          <span
            className="font-bold text-lg text-foreground tracking-wide"
            style={{ letterSpacing: '0.04em' }}
          >
            NHSMers <span style={{ color: '#00d4ff' }}>Repo</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm font-medium rounded-lg"
                style={{
                  color: isActive ? '#00d4ff' : 'rgba(156,163,175,1)',
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = 'white';
                    el.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = 'rgba(156,163,175,1)';
                    el.style.background = 'transparent';
                  }
                }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                    style={{ background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' }}
                  />
                )}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-[var(--border-subtle)] flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-0.5 rounded-full bg-gray-400"
              style={{
                width: i === 1 ? 16 : 22,
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: mobileOpen
                  ? i === 0 ? 'rotate(45deg) translateY(8px)'
                  : i === 2 ? 'rotate(-45deg) translateY(-8px)'
                  : 'scaleX(0)'
                  : 'none',
              }}
            />
          ))}
        </button>
        <div className="md:hidden ml-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        style={{
          maxHeight: mobileOpen ? 280 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          borderTop: mobileOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{
                  color: isActive ? '#00d4ff' : 'rgba(156,163,175,1)',
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'all 0.3s ease',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
