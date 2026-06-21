'use client';

import Link from 'next/link';
import Image from 'next/image';

// ── All text below is taken word-for-word from docs/Nhsmers reposetory.txt ──

const CLUBS = [
  { name: 'Eureka Club', img: '/Pictures/eureka.jpg' },
  { name: 'M4T Club', img: '/Pictures/math for tech.png' },
  { name: 'Stratos Club', img: '/Pictures/stratos.png' },
  { name: '8squared Club', img: '/Pictures/8squared.png' },
  { name: 'Finmatics Club', img: '/Pictures/finmatics.png' },
];

const SPECIALTIES_BRIEF = [
  { abbr: 'MS', name: 'Modeling and Simulation', color: '#00d4ff' },
  { abbr: 'CCS', name: 'Cryptography Coding and Security', color: '#10b981' },
  { abbr: 'SESA', name: 'Statistics Econometrics for Actuarial Sciences', color: '#a855f7' },
  { abbr: 'MP', name: 'Mathematical Physics', color: '#f59e0b' },
  { abbr: 'IMM', name: 'International Masters in Mathematics', color: '#ef4444' },
];

export default function AboutPage() {
  return (
    <div className="w-full pb-16">
      {/* ── Hero / School Description ───────────────────────────── */}
      <section className="relative w-screen -mt-4 md:-mt-8 mb-12 overflow-hidden animate-fade-in-up left-1/2 -translate-x-1/2"
        style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="absolute inset-0">
          <Image src="/Pictures/NHSM.jpg" alt="NHSM Campus" fill className="object-cover opacity-30 dark:opacity-30 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB]/80 via-[#F9FAFB]/40 to-[#F9FAFB] dark:from-[#0B0F19]/80 dark:via-[#0B0F19]/40 dark:to-[#0B0F19]" />
        </div>
        <div className="relative z-10 px-8 py-20 md:py-32 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-main)] mb-6 tracking-tight drop-shadow-lg">
            About <span style={{ color: '#00d4ff' }}>NHSM</span>
          </h1>
          <div className="h-px max-w-xs mx-auto mb-8" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.5), transparent)' }} />
          <p className="text-[var(--text-main)] leading-relaxed text-base md:text-lg mb-8 drop-shadow">
            Established by presidential decree in 2021, the National Higher School of Mathematics (NHSM) is Algeria&apos;s first institution dedicated to awarding engineering degrees in mathematics. Strategically located at the Sidi Abdellah technological hub in Algiers, the school serves as a center of excellence for the nation&apos;s future scientific leaders. To maintain its high academic standards, NHSM exclusively recruits top-tier Baccalaureate graduates from the Mathematics, Experimental Sciences, and Technical Mathematics streams.
          </p>
          <a href="https://nhsm.dz/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105"
            style={{ background: '#00d4ff', color: '#0B0F19' }}>
            Visit the Official Website ↗
          </a>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-0">

      {/* ── Road Map ────────────────────────────────────── */}
      {/* Exact text from docs: [Road map for the school] */}
      <section className="mb-12 animate-fade-in-up delay-200">
        <div className="rounded-2xl p-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-4" style={{ color: '#a855f7' }}>Road Map for the School</h2>
          <p className="text-[var(--text-muted)] leading-relaxed text-base mb-6">
            NHSM offers a 5-year program to all students. It starts with 2 preparatory years, followed by a common core year. Finally, students spend their last 2 years in their chosen specialties (Modeling and Simulation, Cryptography Coding and Security, Statistics Econometrics for Actuarial Sciences, Mathematical Physics). Students also have the chance to participate in the prestigious international program IMM (International Masters in Mathematics).
          </p>
          <a href="https://internationalmathematicsmaster.org/program-overview/algeria/"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: '#a855f7' }}>
            Learn about the IMM Programme ↗
          </a>

          {/* Visual 5-year timeline */}
          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center gap-0">
            {[
              { label: '2 Preparatory Years', sub: 'Year 1 & Year 2', color: '#00d4ff' },
              { label: 'Common Core Year', sub: 'Year 3', color: '#a855f7' },
              { label: '2 Specialty Years', sub: 'Year 4 & Year 5', color: '#10b981' },
            ].map((step, i) => (
              <div key={i} className="flex md:flex-col items-center gap-2 flex-1">
                <div className="flex md:flex-row flex-col items-center w-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: step.color + '20', border: `1px solid ${step.color}50`, color: step.color }}>
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <div className="flex-1 h-px md:h-px w-px md:w-full"
                      style={{ background: `linear-gradient(to right, ${step.color}50, transparent)` }} />
                  )}
                </div>
                <div className="md:text-center mt-1 md:mt-2">
                  <p className="text-sm font-semibold text-[var(--text-main)]">{step.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties Overview ─────────────────────────── */}
      <section className="mb-12 animate-fade-in-up delay-300">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">The 5 Specialties</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {SPECIALTIES_BRIEF.map((sp) => (
            <Link key={sp.abbr} href="/specialties"
              className="rounded-xl p-4 text-center block"
              style={{
                background: sp.color + '0a',
                border: `1px solid ${sp.color}30`,
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = sp.color + '18';
                el.style.border = `1px solid ${sp.color}60`;
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = sp.color + '0a';
                el.style.border = `1px solid ${sp.color}30`;
                el.style.transform = 'none';
              }}
            >
              <div className="font-bold text-lg mb-1" style={{ color: sp.color }}>{sp.abbr}</div>
              <div className="text-xs text-[var(--text-muted)] leading-tight">{sp.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Student Life ─────────────────────────────────── */}
      {/* Exact text from docs: [[Student Life]] */}
      <section className="mb-12 animate-fade-in-up delay-400">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Student Life</h2>

        {/* Clubs — exact text from docs: [[[Clubs]]] */}
        <div className="rounded-2xl p-8 mb-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="font-semibold text-[var(--text-main)] mb-3" style={{ color: '#00d4ff' }}>Clubs</h3>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            NHSM hosts a number of clubs in different fields such as:
          </p>
          <div className="flex flex-wrap gap-4">
            {CLUBS.map((club) => (
              <div key={club.name} className="flex flex-col items-center gap-2 group">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#00d4ff] transition-all relative flex items-center justify-center ${club.name === 'Stratos Club' ? 'bg-white' : ''}`}>
                  <div className={`relative ${club.name === 'Finmatics Club' ? 'w-10 h-10' : 'w-full h-full'}`}>
                    <Image src={club.img} alt={club.name} fill className={club.name === 'Finmatics Club' ? 'object-contain' : 'object-cover'} />
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg text-xs font-medium"
                  style={{
                    background: 'rgba(0,212,255,0.05)',
                    border: '1px solid rgba(0,212,255,0.1)',
                    color: '#00d4ff',
                  }}>
                  {club.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campus — exact text from docs: [[[Campus]]] */}
        <div className="rounded-2xl p-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="font-semibold text-[var(--text-main)] mb-3" style={{ color: '#a855f7' }}>Campus</h3>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
            Students reside at 2 residencies in the Student Hub (Mahelma 3 for boys and Mahelma 4 for girls, shared with ENSIA students) and have access to the full properties of the technological pole (Main Library, Student Hub).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Residency */}
            <div className="rounded-xl overflow-hidden flex flex-col"
              style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <div className="relative w-full h-40">
                <Image src="/Pictures/dorms picture.jpg" alt="Residency" fill className="object-cover opacity-80" />
              </div>
              <div className="p-4 flex-1">
                <h4 className="text-sm font-semibold text-[var(--text-main)] mb-2">The Residency</h4>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                  Hosting 1,000 students per residency, giving students clean individual rooms equipped with a bed, mattress, pillow, desk, and chair. The residency features showers, a large courtyard, an on-campus shop, a university restaurant (resto), a stadium, study rooms, a TV room, and a doctor&apos;s office.
                </p>
              </div>
            </div>

            {/* The Pole */}
            <div className="rounded-xl overflow-hidden flex flex-col"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div className="relative w-full h-40">
                <Image src="/Pictures/Technological pole.jpg" alt="The Pole" fill className="object-cover opacity-80" />
              </div>
              <div className="p-4 flex-1">
                <h4 className="text-sm font-semibold text-[var(--text-main)] mb-2">The Pole</h4>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                  <span className="text-[var(--text-main)] font-medium">Student Hub:</span> Contains the general restaurant, doctors&apos; offices, a laundry room, a shop, a cafeteria, and a dedicated resting area.
                </p>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed mt-2">
                  <span className="text-[var(--text-main)] font-medium">Main Library:</span> Features quiet study rooms open to all pole students and large resting spaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
