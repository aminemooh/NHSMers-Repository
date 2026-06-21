'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 1600, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

function StatCard({ value, suffix, label, color, started }: {
  value: number; suffix: string; label: string; color: string; started: boolean;
}) {
  const count = useCountUp(value, 1400, started);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl md:text-4xl font-bold" style={{ color }}>{count}{suffix}</span>
      <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
    </div>
  );
}

function QuickCard({ href, icon, title, desc, color, id }: {
  href: string; icon: string; title: string; desc: string; color: string; id: string;
}) {
  return (
    <Link
      id={id}
      href={href}
      className="group block rounded-2xl p-6"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = color + '0c';
        el.style.border = `1px solid ${color}40`;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = `0 16px 40px ${color}15`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'var(--bg-card)';
        el.style.border = '1px solid var(--border-light)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ background: color + '18', border: `1px solid ${color}30` }}>
        {icon}
      </div>
      <h3 className="font-bold text-[var(--text-main)] text-base mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] text-sm leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
        Explore <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0,212,255,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 50% 50% at 80% 80%, rgba(168,85,247,0.06) 0%, transparent 70%)
        `,
      }} />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center pt-20 pb-24 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', animation: 'node-idle-pulse 2s ease-in-out infinite' }} />
          Algeria&apos;s First Mathematics Engineering School
        </div>

        {/* Exact text from docs/Nhsmers reposetory.txt */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-main)] mb-6 leading-tight animate-fade-in-up"
          style={{ letterSpacing: '-0.02em', maxWidth: '16ch' }}>
          Welcome to the{' '}
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 60%, #10b981 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            NHSMers Repository
          </span>
        </h1>

        {/* Exact sub-title from docs */}
        <p className="text-[var(--text-muted)] text-xl md:text-2xl mb-3 animate-fade-in-up delay-100 font-medium">
          Your ultimate guide to mastering NHSM
        </p>

        {/* Exact catchy call from docs */}
        <p className="text-[var(--text-muted)] text-lg mb-10 animate-fade-in-up delay-200">
          Learn more about NHSM!
        </p>

        {/* Navigation links as stated in docs */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-300">
          <Link id="hero-cta-resources" href="/resources"
            className="px-8 py-4 rounded-xl font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0ea5e9)',
              color: '#0B0F19',
              boxShadow: '0 0 24px rgba(0,212,255,0.35)',
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-2px) scale(1.02)';
              el.style.boxShadow = '0 0 40px rgba(0,212,255,0.5)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'none';
              el.style.boxShadow = '0 0 24px rgba(0,212,255,0.35)';
            }}
          >
            Resources →
          </Link>
          <Link id="hero-cta-specialties" href="/specialties"
            className="px-8 py-4 rounded-xl font-semibold text-sm"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-light)',
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(168,85,247,0.1)';
              el.style.border = '1px solid rgba(168,85,247,0.4)';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--bg-card)';
              el.style.border = '1px solid var(--border-light)';
              el.style.transform = 'none';
            }}
          >
            Specialties
          </Link>
        </div>

        {/* Floating diamond decorations */}
        <div className="relative w-full max-w-xl mx-auto mt-16 h-16 hidden md:block">
          {[
            { color: '#00d4ff', x: '10%', size: 10, delay: '0s' },
            { color: '#a855f7', x: '30%', size: 7, delay: '0.5s' },
            { color: '#10b981', x: '55%', size: 12, delay: '1s' },
            { color: '#f59e0b', x: '75%', size: 8, delay: '0.3s' },
            { color: '#00d4ff', x: '90%', size: 6, delay: '0.8s' },
          ].map((d, i) => (
            <div key={i} className="absolute top-1/2" style={{
              left: d.x, width: d.size, height: d.size,
              transform: 'rotate(45deg) translateY(-50%)',
              background: d.color, opacity: 0.5,
              boxShadow: `0 0 8px ${d.color}`,
              animation: `diamond-float 4s ease-in-out infinite`,
              animationDelay: d.delay,
            }} />
          ))}
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <section ref={statsRef} className="relative z-10 max-w-4xl mx-auto px-4 mb-24">
        <div className="rounded-2xl px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 0 60px rgba(0,212,255,0.04)',
          }}>
          <StatCard value={5} suffix=" yrs" label="Program Length" color="#00d4ff" started={statsStarted} />
          <StatCard value={5} suffix="" label="Specialties" color="#a855f7" started={statsStarted} />
          <StatCard value={2} suffix="" label="Prep Years" color="#10b981" started={statsStarted} />
          <StatCard value={100} suffix="+" label="Modules" color="#f59e0b" started={statsStarted} />
        </div>
      </section>

      {/* ── QUICK-NAV CARDS ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickCard id="card-resources" href="/resources" icon="🌿" title="Resources"
            desc="Browse the full academic tree — lectures, TDs, exams, and labs for every module."
            color="#00d4ff" />
          <QuickCard id="card-specialties" href="/specialties" icon="◆" title="Specialties"
            desc="Explore the 5 engineering tracks: MS, SESA, CCS, MP, and IMM."
            color="#a855f7" />
          <QuickCard id="card-about" href="/about" icon="🏛️" title="About NHSM"
            desc="Learn about Algeria's first mathematics engineering school, its campus, and student life."
            color="#10b981" />
          <QuickCard id="card-contribute" href="/contact" icon="✦" title="Contribute"
            desc="Have a better TD solution? Found an amazing YouTube playlist? Add it to the tree!"
            color="#f59e0b" />
        </div>
      </section>
    </div>
  );
}
