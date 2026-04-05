import { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  /** 'user' = หน้าหลัก (VITE_USER_PASSWORD), 'admin' = จัดการข้อมูล (VITE_ADMIN_PASSWORD) */
  mode?: 'user' | 'admin';
}

export default function AdminLogin({ onLoginSuccess, mode = 'user' }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const correctPassword =
      mode === 'admin'
        ? (import.meta.env.VITE_ADMIN_PASSWORD || '')
        : (import.meta.env.VITE_USER_PASSWORD || '');

    if (password === correctPassword) {
      onLoginSuccess();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => {
        setError(false);
        setShaking(false);
      }, 700);
    }
  };

  const isAdminMode = mode === 'admin';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* ── Background Ambience ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-red-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-rose-900/10 rounded-full blur-[100px] mix-blend-screen opacity-50" />
        {!isAdminMode && (
          <div className="absolute top-1/3 right-[15%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] bg-pink-900/10 rounded-full blur-[80px] mix-blend-screen opacity-40 animate-pulse [animation-delay:1.5s]" />
        )}
      </div>

      {/* ── Card ── */}
      <div
        className={`
          w-full max-w-md relative z-10
          bg-gradient-to-br from-red-950/40 to-pink-900/20 backdrop-blur-2xl
          rounded-3xl p-8
          animate-in fade-in slide-in-from-bottom-8 duration-700
          ${shaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}
        `}
        style={shaking ? { animation: 'shake 0.4s ease-in-out' } : {}}
      >

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/nt-amn-3.png"
            alt="Armani Login Logo"
            className="w-24 h-auto object-contain mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-2xl font-bold text-white mb-1 font-display">
            Namtan x Armani
          </h1>
          <p className="text-white/40 text-xs tracking-[0.25em] uppercase mt-1">
            {isAdminMode ? 'Admin Access' : 'Private Access'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••••••"
              className={`
                w-full bg-black/50 rounded-xl px-4 py-3.5 outline-none
                text-white placeholder:text-zinc-600
                font-mono tracking-widest
                border transition-all focus:ring-2
                ${error
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-white/10 focus:border-red-500/50 focus:ring-red-500/20'
                }
              `}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs font-medium pl-1 animate-in fade-in slide-in-from-top-1">
                รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold rounded-xl py-3.5 transition-all shadow-lg active:scale-[0.98] uppercase tracking-wider"
          >
            เข้าสู่ระบบ
          </button>
        </form>

      </div>

      {/* Shake keyframes injected as a style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-10px); }
          30%       { transform: translateX(10px); }
          45%       { transform: translateX(-8px); }
          60%       { transform: translateX(8px); }
          75%       { transform: translateX(-4px); }
          90%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
