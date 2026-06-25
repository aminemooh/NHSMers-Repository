'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactPage() {
  const [moduleName, setModuleName] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleName || !link) {
      setError('Please fill in both Module Name and Resource Link.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Save to Firestore so it appears in the admin inbox
      await addDoc(collection(db, 'contributions'), {
        moduleName,
        link,
        notes: notes || '',
        status: 'pending',
        timestamp: new Date().toISOString(),
      });

      setSuccess(true);
      setModuleName('');
      setLink('');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-16 px-4">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="text-center pt-8 pb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Support Us</h1>
        <div className="h-px max-w-xs mx-auto" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.5), transparent)' }} />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* ── Contribution Form ────────────────────────────── */}
        <section className="animate-fade-in-up delay-100">
          <div className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Send className="w-6 h-6 text-purple-500" /> Contributing Form
            </h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
              Would you like to support us and provide the resources you have?
              You can fill out this form, and we will upload it to the drive. Thank you!
            </p>

            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
              {error && <div className="text-red-400 text-xs font-semibold px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Module Name / Description
                </label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full bg-black/20 border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="e.g. Analysis 1 TD Solutions"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Resource Link (Drive, Mega, etc.)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-black/20 border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="https://"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black/20 border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  placeholder="Any specific details?"
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-bold text-sm mt-4 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,212,255,0.2))', border: '1px solid rgba(168,85,247,0.4)', color: 'var(--text-main)', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  if (isSubmitting) return;
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.3))';
                  el.style.boxShadow = '0 0 20px rgba(168,85,247,0.2)';
                }}
                onMouseLeave={(e) => {
                  if (isSubmitting) return;
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,212,255,0.2))';
                  el.style.boxShadow = 'none';
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Resource'}
              </button>
            </form>

            {success && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in" style={{ background: 'rgba(11, 15, 25, 0.95)', backdropFilter: 'blur(8px)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.5)', color: '#10b981', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Thank you!</h3>
                <p className="text-[var(--text-muted)] text-sm">Your contribution has been submitted successfully.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
