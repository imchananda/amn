import { useState } from 'react';

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรวจสอบกับรหัสผ่านจาก .env
    const correctPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || '';

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

      <div className="w-full max-w-md bg-gradient-to-br from-red-950/40 to-pink-900/20 backdrop-blur-2xl rounded-3xl p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          {/* Custom Armani Icon Image */}
          <img 
            src="/nt-amn-2.png" 
            alt="Armani Login Logo" 
            className="w-24 h-auto object-contain mx-auto mb-6" 
          />
          <h1 className="text-2xl font-bold text-white mb-2 font-display">Namtan x Armani</h1>
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
