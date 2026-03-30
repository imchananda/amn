import { useLanguage } from '../i18n/LanguageContext';

// SVG Icons (same ones used in App.tsx)
const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);
const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" /><polygon fill="#fff" points="9.545,15.568 15.818,12 9.545,8.432" />
    </svg>
);
const ThreadsIcon = () => (
    <svg viewBox="0 0 192 192" fill="currentColor" className="w-4 h-4">
        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.305C133.506 125.625 136.685 117.133 137.997 106.507C143.4 109.607 147.128 113.932 148.697 119.498C151.194 128.404 151.032 141.101 141.208 150.601C132.605 158.926 122.244 162.646 106.064 162.765C88.3396 162.632 74.5494 157.308 65.0463 146.951C56.0809 137.181 51.4292 122.671 51.2403 103.873C51.4292 85.0754 56.0809 70.5653 65.0463 60.7954C74.5494 50.4384 88.3396 45.1138 106.064 44.981C123.925 45.1146 137.936 50.4558 147.5 60.9508L159.19 50.2968C146.856 36.9943 129.815 30.1666 106.112 30.001C88.0218 30.1334 72.336 35.5658 60.5347 46.1069C49.6617 55.7681 43.5026 69.8135 42.7867 86.8346C42.7644 87.3604 42.7534 87.8871 42.7534 88.4142C42.7534 88.9429 42.7644 89.4696 42.7867 89.9953C43.5026 107.016 49.6617 121.062 60.5347 130.723C72.336 141.264 88.0218 146.696 106.112 146.829C106.205 146.829 106.298 146.83 106.391 146.83C124.214 146.83 138.932 141.708 149.157 132.012C161.688 120.088 161.537 104.407 157.76 95.3652C155.231 89.3717 149.459 83.8547 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
    </svg>
);

// Platform definitions for the mini cards
const PLATFORMS: {
    id: string;
    label: string;
    icon: JSX.Element;
    gradient: string;
    metrics: ('likes' | 'comments' | 'shares' | 'reposts' | 'views' | 'saves')[];
}[] = [
        { id: 'instagram', label: 'Instagram', icon: <InstagramIcon />, gradient: 'from-rose-400 to-purple-500', metrics: ['likes', 'comments', 'shares', 'saves'] },
        { id: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, gradient: 'from-zinc-800 to-slate-700', metrics: ['likes', 'comments', 'shares', 'saves'] },
        { id: 'x', label: 'X', icon: <XIcon />, gradient: 'from-slate-700 to-slate-900', metrics: ['likes', 'comments', 'reposts'] },
        { id: 'facebook', label: 'Facebook', icon: <FacebookIcon />, gradient: 'from-blue-500 to-blue-700', metrics: ['likes', 'comments', 'shares'] },
        { id: 'youtube', label: 'YouTube', icon: <YouTubeIcon />, gradient: 'from-red-500 to-red-700', metrics: ['likes', 'comments', 'views'] },
        { id: 'threads', label: 'Threads', icon: <ThreadsIcon />, gradient: 'from-zinc-800 to-black', metrics: ['likes', 'comments', 'reposts'] },
    ];

type StatKey = 'likes' | 'comments' | 'shares' | 'reposts' | 'views' | 'saves';

interface PlatformStats {
    likes: number;
    comments: number;
    shares: number;
    reposts: number;
    views: number;
    saves: number;
}

interface GoalItem {
    label: string;
    current: number;
    target: number;
    color: string;
}

interface ProfileCardProps {
    platformStatsMap: Record<string, PlatformStats>;
    goals: GoalItem[];
    onMinimize?: () => void;
}

function fmt(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toLocaleString();
}

export function ProfileCard({ platformStatsMap, goals, onMinimize }: ProfileCardProps) {
    const { t } = useLanguage();

    const METRIC_LABEL: Record<StatKey, () => string> = {
        likes: () => t('likes'),
        comments: () => t('comments'),
        shares: () => t('shares'),
        reposts: () => t('reposts'),
        views: () => t('viewsLabel'),
        saves: () => t('savesLabel'),
    };

    return (
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-4 sm:p-5 mx-0 mb-4 border border-agtic-warm/30 shadow-2xl shadow-black/5 relative overflow-hidden group">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-28 h-28 bg-agtic-warm/25 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4">

                {/* ── Section Header ── */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-agtic-gold font-serif text-base">✦</span>
                        <h3 className="text-xs font-bold text-agtic-charcoal uppercase tracking-[0.15em]">Platform Engagement</h3>
                    </div>
                    {onMinimize && (
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={onMinimize}
                                className="w-7 h-7 rounded-lg bg-agtic-warm/25 text-agtic-charcoal border border-agtic-warm/40 shadow-sm hover:bg-agtic-warm/40 active:scale-95 flex items-center justify-center"
                                title={t('minimize')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <span className="text-[6.5px] font-bold text-agtic-charcoal/50 uppercase tracking-[0.1em] animate-pulse text-center leading-tight">
                                {t('tapToHide')}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Platform Cards (scrollable row) ── */}
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                    {PLATFORMS.map(p => {
                        const stats = platformStatsMap[p.id];
                        const total = stats
                            ? p.metrics.reduce((sum, key) => sum + (stats[key] || 0), 0)
                            : 0;

                        return (
                            <div
                                key={p.id}
                                className="flex-shrink-0 w-[100px] bg-white rounded-2xl border border-agtic-warm/30 shadow-sm overflow-hidden flex flex-col"
                            >
                                {/* Platform header */}
                                <div className={`bg-gradient-to-br ${p.gradient} flex items-center gap-1.5 px-2.5 py-2`}>
                                    <span className="text-white">{p.icon}</span>
                                    <span className="text-white text-[10px] font-bold truncate">{p.label}</span>
                                </div>

                                {/* Metrics */}
                                <div className="p-2 flex flex-col gap-1 flex-1">
                                    {p.metrics.map(key => (
                                        <div key={key} className="flex justify-between items-baseline gap-1">
                                            <span className="text-[8.5px] text-agtic-taupe/70 uppercase tracking-wider truncate">
                                                {METRIC_LABEL[key]()}
                                            </span>
                                            <span className="text-[10px] font-bold text-agtic-charcoal tabular-nums">
                                                {stats ? fmt(stats[key] || 0) : '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total footer */}
                                <div className="bg-agtic-cream/60 px-2.5 py-1.5 border-t border-agtic-warm/30 flex items-baseline justify-between">
                                    <span className="text-[8px] text-agtic-taupe/60 uppercase tracking-wider font-medium">Total</span>
                                    <span className="text-[11px] font-bold text-agtic-charcoal tabular-nums">{fmt(total)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Divider ── */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-agtic-warm/40" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-agtic-taupe/60">Goal Progress</span>
                    <div className="flex-1 h-px bg-agtic-warm/40" />
                </div>

                {/* ── Progress Bars ── */}
                <div className="flex flex-col gap-3">
                    {goals.map((goal, i) => {
                        const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
                        return (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-agtic-charcoal/80 uppercase tracking-wider">
                                        {goal.label}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-bold text-agtic-charcoal tabular-nums">{fmt(goal.current)}</span>
                                        <span className="text-[10px] text-agtic-taupe/60">/ {fmt(goal.target)}</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-agtic-warm/30 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${goal.color} transition-all duration-1000 ease-out`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <div className="text-right text-[9px] font-medium text-agtic-charcoal/50">
                                    {pct.toFixed(1)}%
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
