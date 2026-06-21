'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

interface Contribution {
  id: string;
  moduleName: string;
  link: string;
  notes: string;
  status: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inbox' | 'tree' | 'content' | 'specialties'>('inbox');
  
  // Inbox State
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push('/admin/login');
  };

  const fetchContributions = async () => {
    setLoading(true);
    setError('');
    try {
      const querySnapshot = await getDocs(collection(db, 'contributions'));
      const data: Contribution[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Contribution);
      });
      // Sort by newest
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setContributions(data);
    } catch (err: any) {
      if (err.message.includes('API key not valid') || err.message.includes('dummy-api-key') || err.message.includes('projectId')) {
        setError('Firebase not configured. Displaying mock data.');
        setContributions([
          { id: 'mock1', moduleName: 'Analysis 1 TD', link: 'https://example.com/td', notes: 'First TD series', status: 'pending', timestamp: new Date().toISOString() },
          { id: 'mock2', moduleName: 'Physics Exam', link: 'https://example.com/exam', notes: 'Exam from 2023', status: 'approved', timestamp: new Date(Date.now() - 86400000).toISOString() },
        ]);
      } else {
        setError(err.message || 'Failed to fetch contributions.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inbox') {
      fetchContributions();
    }
  }, [activeTab]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'contributions', id), { status: newStatus });
      setContributions((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error(err);
      // Mock update
      setContributions((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  const deleteContribution = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contributions', id));
      setContributions((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      // Mock delete
      setContributions((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // ── Render Tabs ──────────────────────────────────────────

  const renderInbox = () => {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span style={{ color: '#00d4ff' }}>📥</span> Inbox
          </h2>
          <button onClick={fetchContributions} className="text-sm text-[var(--text-muted)] hover:text-foreground flex items-center gap-1">
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs font-semibold px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-[var(--text-muted)] text-sm py-8 text-center animate-pulse">Loading contributions...</div>
        ) : contributions.length === 0 ? (
          <div className="text-[var(--text-muted)] text-sm py-12 text-center border border-dashed border-[var(--border-light)] rounded-xl">
            Inbox is empty. No new contributions.
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((c) => (
              <div key={c.id} className="p-5 rounded-xl flex flex-col gap-3"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-foreground mb-1">{c.moduleName}</div>
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: '#a855f7' }}>
                      {c.link}
                    </a>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full"
                    style={{
                      background: c.status === 'pending' ? 'rgba(245,158,11,0.1)' : c.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: c.status === 'pending' ? '#f59e0b' : c.status === 'approved' ? '#10b981' : '#ef4444',
                      border: `1px solid ${c.status === 'pending' ? 'rgba(245,158,11,0.2)' : c.status === 'approved' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}>
                    {c.status}
                  </span>
                </div>
                {c.notes && <div className="text-xs text-[var(--text-muted)] bg-black/20 p-2 rounded-lg">"{c.notes}"</div>}
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
                  <span className="text-xs text-[var(--text-muted)]">{new Date(c.timestamp).toLocaleString()}</span>
                  <div className="flex gap-2">
                    {c.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(c.id, 'approved')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(c.id, 'rejected')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">
                          Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteContribution(c.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--border-light)] hover:text-foreground border border-[var(--border-light)] transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPlaceholder = (title: string, desc: string, color: string) => (
    <div className="animate-fade-in py-10 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>
        ⚙️
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-gray-400 text-sm max-w-sm mx-auto">{desc}</p>
      <div className="mt-8 px-4 py-2 inline-block rounded-lg text-xs font-semibold text-[var(--text-muted)]" style={{ border: '1px dashed var(--border-subtle)' }}>
        In Development
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="flex justify-between items-center pt-8 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Admin <span style={{ color: '#00d4ff' }}>Portal</span></h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* ── Sidebar ────────────────────────────────────────── */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
          {[
            { id: 'inbox', label: 'Inbox', icon: '📥', color: '#00d4ff' },
            { id: 'tree', label: 'Resources Tree', icon: '🌳', color: '#a855f7' },
            { id: 'content', label: 'Content Manager', icon: '📝', color: '#10b981' },
            { id: 'specialties', label: 'Specialties', icon: '⬡', color: '#f59e0b' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? `${tab.color}15` : 'var(--bg-card)',
                border: `1px solid ${activeTab === tab.id ? `${tab.color}50` : 'var(--border-light)'}`,
                color: activeTab === tab.id ? '#fff' : '#9ca3af',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content Area ───────────────────────────────────── */}
        <div className="flex-1 min-h-[500px] rounded-2xl p-6 md:p-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          {activeTab === 'inbox' && renderInbox()}
          {activeTab === 'tree' && renderPlaceholder('Resources Tree', 'Manage nodes, modules, and resource links directly on the academic tree.', '#a855f7')}
          {activeTab === 'content' && renderPlaceholder('Content Manager', 'Edit text for About, Landing page, and static sections without touching code.', '#10b981')}
          {activeTab === 'specialties' && renderPlaceholder('Specialties', 'Update specialty descriptions, projects, and division details.', '#f59e0b')}
        </div>

      </div>
    </div>
  );
}
