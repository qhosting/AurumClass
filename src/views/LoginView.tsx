import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginView({ onLoginSuccess, onBack }: { onLoginSuccess: (user: any) => void; onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[48px] shadow-2xl shadow-indigo-100 p-10 md:p-14 relative z-10 border border-slate-100"
      >
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowRight className="rotate-180" size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="w-2 h-2 bg-indigo-900 rounded-sm" />
              <div className="w-2 h-2 bg-indigo-900 rounded-sm" />
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">AurumClass</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Bienvenido</h2>
          <p className="text-slate-400 text-sm font-medium">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Email Institucional</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-indigo-900 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@aurumclass.pro"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-900/10 text-sm font-bold placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-indigo-900 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-900/10 text-sm font-bold placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Entrar <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
          <button 
            type="button"
            onClick={async () => {
              const res = await fetch('/api/auth/google/url');
              const { url } = await res.json();
              window.location.href = url;
            }}
            className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
            Continuar con Google
          </button>
          
          <p className="text-slate-400 text-xs font-medium italic text-center">
            <Sparkles size={12} className="inline mr-1 text-yellow-500" />
            Usa tu cuenta institucional para acceso directo.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
