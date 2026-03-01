import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// GID for leaderboard sheet
const LEADERBOARD_GID = '1374663581';
// Replace with your actual Google Form URL when ready
const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID'; // TODO: update this URL

interface LeaderboardEntry {
    name: string;
    tasksDone: number;
    submittedAt?: string;
    note?: string;
}

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalTasksCount: number;
}

const RANK_BADGE: Record<number, string> = {
    0: '🥇',
    1: '🥈',
    2: '🥉',
};

function parseCSVSimple(text: string): string[][] {
    const rows: string[][] = [];
    const lines = text.split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        const cells = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
        rows.push(cells);
    }
    return rows;
}

export default function LeaderboardModal({ isOpen, onClose, totalTasksCount }: LeaderboardModalProps) {
    const { language } = useLanguage();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/sheet?gid=${LEADERBOARD_GID}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const rows = parseCSVSimple(text.replace(/^\uFEFF/, ''));
            if (rows.length < 2) {
                setEntries([]);
                return;
            }
            const headers = rows[0].map(h => h.toLowerCase().trim());
            const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('ชื่อ'));
            const tasksIdx = headers.findIndex(h => h.includes('task') || h.includes('mission') || h.includes('จำนวน'));
            const noteIdx = headers.findIndex(h => h.includes('note') || h.includes('หมาย') || h.includes('comment'));
            const dateIdx = headers.findIndex(h => h.includes('timestamp') || h.includes('date') || h.includes('time'));

            const parsed: LeaderboardEntry[] = [];
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const name = nameIdx >= 0 ? row[nameIdx]?.trim() : '';
                const rawTasks = tasksIdx >= 0 ? row[tasksIdx]?.trim() : '';
                const tasksDone = parseInt(rawTasks, 10) || 0;
                const note = noteIdx >= 0 ? row[noteIdx]?.trim() : '';
                const submittedAt = dateIdx >= 0 ? row[dateIdx]?.trim() : '';
                if (name) parsed.push({ name, tasksDone, note, submittedAt });
            }

            // Sort: most tasks done first, then alphabetically
            parsed.sort((a, b) => b.tasksDone - a.tasksDone || a.name.localeCompare(b.name));
            setEntries(parsed);
            setLastUpdated(new Date().toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
        } catch (e) {
            console.error('Leaderboard fetch error:', e);
            setError(language === 'th' ? 'โหลดไม่ได้ชั่วคราว กรุณาลองใหม่' : 'Could not load leaderboard. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        if (isOpen) fetchLeaderboard();
    }, [isOpen, fetchLeaderboard]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-prada-charcoal/70 backdrop-blur-md" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-b from-prada-offwhite to-prada-cream rounded-t-3xl sm:rounded-3xl border border-prada-warm/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                    {/* Gold accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-prada-gold via-prada-warm to-prada-gold" />

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 pb-3 flex-shrink-0">
                        <div>
                            <h2 className="text-lg font-bold text-prada-charcoal flex items-center gap-2">
                                🏅 {language === 'th' ? 'Leaderboard' : 'Leaderboard'}
                            </h2>
                            <p className="text-prada-taupe text-xs mt-0.5">
                                {language === 'th' ? 'Top Supporters — Namtan x Prada' : 'Top Supporters — Namtan x Prada'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchLeaderboard}
                                disabled={loading}
                                className="w-8 h-8 rounded-full bg-prada-warm/30 hover:bg-prada-warm/50 flex items-center justify-center transition-colors"
                                title={language === 'th' ? 'รีเฟรช' : 'Refresh'}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 text-prada-charcoal ${loading ? 'animate-spin' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-prada-warm/30 hover:bg-prada-warm/50 flex items-center justify-center text-prada-charcoal/70 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0">
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-2 border-prada-gold border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">😔</div>
                                <p className="text-prada-taupe text-sm">{error}</p>
                                <button onClick={fetchLeaderboard} className="mt-3 text-xs text-prada-gold underline">
                                    {language === 'th' ? 'ลองอีกครั้ง' : 'Try again'}
                                </button>
                            </div>
                        )}

                        {!loading && !error && entries.length === 0 && (
                            <div className="text-center py-10">
                                <div className="text-5xl mb-3">🌟</div>
                                <p className="text-prada-charcoal font-semibold text-sm">
                                    {language === 'th' ? 'ยังไม่มีข้อมูลใน Leaderboard' : 'No entries yet'}
                                </p>
                                <p className="text-prada-taupe text-xs mt-1">
                                    {language === 'th' ? 'เป็นคนแรกที่ submit ชื่อคุณ!' : 'Be the first to submit your name!'}
                                </p>
                            </div>
                        )}

                        {!loading && !error && entries.length > 0 && (
                            <div className="flex flex-col gap-2 pb-2">
                                {entries.slice(0, 50).map((entry, idx) => {
                                    const pct = totalTasksCount > 0 ? Math.min(Math.round((entry.tasksDone / totalTasksCount) * 100), 100) : 0;
                                    const isTop3 = idx < 3;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isTop3
                                                ? 'bg-gradient-to-r from-prada-gold/10 to-prada-warm/10 border-prada-gold/30'
                                                : 'bg-white/60 border-prada-warm/20'
                                                }`}
                                        >
                                            {/* Rank */}
                                            <div className="w-8 text-center flex-shrink-0">
                                                {isTop3
                                                    ? <span className="text-xl leading-none">{RANK_BADGE[idx]}</span>
                                                    : <span className="text-sm font-bold text-prada-taupe/70 tabular-nums">#{idx + 1}</span>
                                                }
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`font-bold truncate ${isTop3 ? 'text-prada-charcoal' : 'text-prada-charcoal/80'} text-sm`}>
                                                        {entry.name}
                                                    </span>
                                                    <span className={`flex-shrink-0 text-xs font-bold tabular-nums ${isTop3 ? 'text-prada-gold' : 'text-prada-taupe'}`}>
                                                        {entry.tasksDone > 0 ? `${entry.tasksDone} tasks` : '—'}
                                                    </span>
                                                </div>
                                                {entry.tasksDone > 0 && (
                                                    <div className="mt-1 h-1 bg-prada-warm/30 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-prada-gold to-prada-warm rounded-full transition-all duration-700"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                )}
                                                {entry.note && (
                                                    <p className="text-prada-taupe text-[10px] mt-0.5 truncate italic">"{entry.note}"</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 pt-2 flex-shrink-0 border-t border-prada-warm/30 bg-prada-cream/50">
                        {lastUpdated && (
                            <p className="text-prada-taupe/60 text-[10px] text-center mb-2">
                                {language === 'th' ? `อัปเดตล่าสุด ${lastUpdated}` : `Last updated ${lastUpdated}`}
                            </p>
                        )}
                        <a
                            href={GOOGLE_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 px-4 rounded-xl bg-prada-charcoal hover:bg-prada-black text-prada-offwhite text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.01]"
                        >
                            <span>✏️</span>
                            <span>{language === 'th' ? 'Submit ชื่อของคุณ' : 'Submit Your Name'}</span>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
