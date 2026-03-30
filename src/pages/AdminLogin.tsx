import { useState } from 'react';

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรวจสอบกับรหัสผ่านจาก .env หรือรหัสอ้างอิง
    const correctPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'engagement07NTF';

    if (password === correctPassword) {
      sessionStorage.setItem('agtic_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambience สไตล์ดำ-แดง */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-red-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-rose-900/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-900 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-red-900/50">
            {/* กุญแจ ล็อคแม่กุญแจ Icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-white stroke-2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-display">N.T. Data Center</h1>
          <p className="text-sm text-zinc-400">กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบส่วนควบคุม</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••••••"
              className={`w-full bg-black/50 border ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:border-red-500/50 focus:ring-red-500/20'} rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 outline-none focus:ring-2 transition-all font-mono tracking-widest`}
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
    </div>
  );
}
