import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface Task {
    id: string;
    phase: string;
    platform: string;
    url: string;
    hashtags: string;
    title: string;
    flashEnd?: string;
    likes: number;
    comments: number;
    shares: number;
    reposts: number;
    views?: number;
    saves?: number;
}

interface FlashTaskCardProps {
    task: Task;
    isCompleted: boolean;
    onClick: () => void;
    onQuickComplete: (e: React.MouseEvent) => void;
}

const PLATFORM_GRADIENT: Record<string, string> = {
    instagram: 'from-rose-400 to-purple-500',
    tiktok: 'from-zinc-800 to-slate-700',
    x: 'from-slate-700 to-slate-900',
    facebook: 'from-blue-500 to-blue-700',
    youtube: 'from-red-500 to-red-700',
    threads: 'from-zinc-800 to-black',
};

function formatCountdown(msLeft: number): { display: string; urgent: boolean; expired: boolean } {
    if (msLeft <= 0) return { display: '⏰ หมดเวลา', urgent: false, expired: true };

    const totalSecs = Math.floor(msLeft / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    if (h > 24) {
        const days = Math.floor(h / 24);
        return { display: `${days}d ${h % 24}h เหลือ`, urgent: days === 0, expired: false };
    }
    if (h > 0) {
        return { display: `${h}h ${m}m เหลือ`, urgent: h < 1, expired: false };
    }
    return {
        display: `${m}m ${s}s เหลือ`,
        urgent: true,
        expired: false,
    };
}

export default function FlashTaskCard({ task, isCompleted, onClick, onQuickComplete }: FlashTaskCardProps) {
    const { language } = useLanguage();
    const [msLeft, setMsLeft] = useState<number>(() => {
        if (!task.flashEnd) return 0;
        return new Date(task.flashEnd).getTime() - Date.now();
    });

    useEffect(() => {
        if (!task.flashEnd) return;
        const tick = () => {
            const remaining = new Date(task.flashEnd!).getTime() - Date.now();
            setMsLeft(remaining);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [task.flashEnd]);

    const { display: countdownDisplay, urgent, expired } = formatCountdown(msLeft);
    const gradient = PLATFORM_GRADIENT[task.platform] || 'from-gray-500 to-gray-700';

    return (
        <div
            className={`relative flex items-stretch rounded-2xl overflow-hidden border transition-all cursor-pointer group ${isCompleted
                ? 'opacity-60 border-prada-warm/20'
                : expired
                    ? 'border-gray-300/30 opacity-50'
                    : urgent
                        ? 'border-orange-400/50 shadow-lg shadow-orange-400/10'
                        : 'border-amber-400/40 shadow-lg shadow-amber-400/10'
                }`}
            onClick={onClick}
        >
            {/* Left platform stripe */}
            <div className={`w-2 flex-shrink-0 bg-gradient-to-b ${gradient}`} />

            {/* Main content */}
            <div className="flex-1 bg-white p-3 flex flex-col gap-2">
                {/* Top row: platform tag + countdown */}
                <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-white text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${gradient}`}>
                        {task.platform}
                    </span>
                    {/* Countdown badge */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${expired
                        ? 'bg-gray-100 text-gray-400'
                        : urgent
                            ? 'bg-orange-50 text-orange-600 animate-pulse'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                        <span>{expired ? '⏰' : urgent ? '🔥' : '⚡'}</span>
                        <span>{countdownDisplay}</span>
                    </span>
                </div>

                {/* Title */}
                <p className="text-prada-charcoal text-xs font-semibold leading-tight line-clamp-2">
                    {task.title || `${task.platform} Flash Mission`}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[10px] text-prada-taupe/70">
                    {task.likes > 0 && <span>❤️ {task.likes.toLocaleString()}</span>}
                    {task.comments > 0 && <span>💬 {task.comments.toLocaleString()}</span>}
                    {task.reposts > 0 && <span>🔁 {task.reposts.toLocaleString()}</span>}
                    {(task.views ?? 0) > 0 && <span>👁️ {(task.views ?? 0).toLocaleString()}</span>}
                </div>

                {/* Action row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-prada-warm/20">
                    <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${expired
                            ? 'bg-gray-100 text-gray-400 pointer-events-none'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                            }`}
                    >
                        <span>⚡</span>
                        <span>{language === 'th' ? 'ไปทำเลย' : 'Go Now'}</span>
                    </a>

                    {!isCompleted && !expired && (
                        <button
                            onClick={onQuickComplete}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        >
                            ✓ {language === 'th' ? 'ทำแล้ว' : 'Done'}
                        </button>
                    )}
                    {isCompleted && (
                        <span className="text-[10px] text-emerald-600 font-bold">✓ {language === 'th' ? 'ทำแล้ว' : 'Done'}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
