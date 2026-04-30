import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MonitorPlay, 
  ShieldCheck, 
  Zap, 
  Users,
  Globe,
  LayoutDashboard
} from 'lucide-react';

export default function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-yellow-200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-indigo-900 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-indigo-900 rounded-sm" />
              <div className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">AurumClass</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-600 hover:text-indigo-900 transition-colors">Funcionalidades</a>
            <a href="#ai" className="text-sm font-bold text-slate-600 hover:text-indigo-900 transition-colors">Aurum AI</a>
            <a href="#integration" className="text-sm font-bold text-slate-600 hover:text-indigo-900 transition-colors">Integraciones</a>
            <button 
              onClick={onStart}
              className="px-6 py-2.5 bg-indigo-900 text-white rounded-full text-sm font-bold hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-100"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-700 rounded-full text-xs font-black tracking-widest uppercase mb-8 border border-yellow-400/20"
          >
            <Sparkles size={14} /> La Nueva Era de la Educación Inteligente
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter"
          >
            Gestión Académica <br />
            <span className="text-indigo-900">Sin Límites.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-slate-500 mb-12 leading-relaxed"
          >
            AurumClass une el poder de la Inteligencia Artificial de Gemini con la simplicidad de Google Classroom para transformar tu institución educativa hoy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center gap-4"
          >
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-indigo-900 text-white rounded-3xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl shadow-indigo-200"
            >
              Comenzar Ahora <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-3xl font-bold text-lg hover:bg-slate-50 transition-colors">
              Ver Demo Interactiva
            </button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl opacity-30" />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard label="Instituciones" value="500+" />
          <StatCard label="Alumnos" value="1.2M" />
          <StatCard label="Cursos Sincronizados" value="45K" />
          <StatCard label="Precisión IA" value="99.9%" />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Todo lo que necesitas, <br /> unificado en un solo lugar.</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Diseñado para la excelencia académica y la eficiencia administrativa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={LayoutDashboard} 
              title="Dashboard Centralizado" 
              desc="Visualiza el rendimiento de toda tu institución en tiempo real con métricas clave y alertas automáticas."
              color="bg-yellow-400"
            />
            <FeatureCard 
              icon={MonitorPlay} 
              title="Google Classroom Sync" 
              desc="Sincronización bidireccional de tareas, alumnos y calificaciones. Olvídate de la carga manual de datos."
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Seguridad de Grado Bancario" 
              desc="Tus datos están protegidos con encriptación de extremo a extremo y cumplimiento con estándares educativos."
              color="bg-indigo-900"
            />
            <FeatureCard 
              icon={Zap} 
              title="Automatización de Pagos" 
              desc="Gestión de becas y recordatorios de pago inteligentes para reducir la morosidad institucional."
              color="bg-emerald-500"
            />
            <FeatureCard 
              icon={Users} 
              title="Portal de Alumnos" 
              desc="Una experiencia móvil moderna para que tus estudiantes gestionen su vida académica sin fricciones."
              color="bg-orange-500"
            />
            <FeatureCard 
              icon={Globe} 
              title="Escalabilidad Multi-tenant" 
              desc="Gestiona múltiples campus o instituciones desde una única consola administrativa central."
              color="bg-purple-500"
            />
          </div>
        </div>
      </section>

      {/* AI Section (Aurum AI) */}
      <section id="ai" className="py-32 px-6 bg-[#1A1A2E] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-yellow-400 rounded-full text-xs font-black tracking-widest uppercase mb-8">
              <Sparkles size={14} /> Aurum AI (By Gemini)
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              La IA que realmente <br /> entiende a tus alumnos.
            </h2>
            <ul className="space-y-6">
              <AIFeature icon={CheckCircle2} title="Planificación Predictiva" desc="Genera planes de estudio personalizados basados en el ritmo de aprendizaje." />
              <AIFeature icon={CheckCircle2} title="Calificación Asistida" desc="Ahorra horas a tus docentes con retroalimentación automática inteligente." />
              <AIFeature icon={CheckCircle2} title="Detección de Deserción" desc="Identifica proactivamente alumnos en riesgo antes de que suceda." />
            </ul>
            <button className="mt-12 px-8 py-4 bg-yellow-400 text-slate-900 rounded-2xl font-bold hover:scale-105 transition-transform">
              Descubrir Aurum AI
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="w-[500px] h-[500px] bg-indigo-500/20 rounded-[80px] rotate-12 absolute -top-10 -left-10 blur-2xl" />
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[48px] relative z-10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Aurum Assistant</h4>
                  <p className="text-xs text-slate-400">Analizando rendimiento...</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-yellow-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "Se ha detectado una mejora del 15% en el promedio grupal tras implementar el módulo de Cálculo Diferencial con apoyo de IA."
                </p>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-indigo-500/30 rounded-lg text-[10px] font-bold">PROGRESO +15%</div>
                  <div className="px-3 py-1 bg-emerald-500/30 rounded-lg text-[10px] font-bold">ALERTA: ESTABLE</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-yellow-400 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 relative z-10">¿Listo para transformar <br /> tu institución?</h2>
          <p className="text-slate-800/70 text-lg mb-12 font-medium relative z-10">Únete a cientos de escuelas que ya están usando AurumClass para liderar el futuro educativo.</p>
          <button 
            onClick={onStart}
            className="px-12 py-6 bg-indigo-900 text-white rounded-[32px] font-bold text-xl hover:scale-105 transition-transform shadow-2xl shadow-indigo-900/20 relative z-10"
          >
            Obtener AurumClass Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
              <div className="w-2 h-2 bg-indigo-900 rounded-sm" />
              <div className="w-2 h-2 bg-indigo-900 rounded-sm" />
              <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">AurumClass</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 AurumClass. Hecho con ❤️ en México para el mundo.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-900 text-sm font-bold">Privacidad</a>
            <a href="#" className="text-slate-400 hover:text-indigo-900 text-sm font-bold">Términos</a>
            <a href="#" className="text-slate-400 hover:text-indigo-900 text-sm font-bold">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-black text-indigo-900 mb-2 tracking-tighter">{value}</span>
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="p-8 rounded-[40px] border border-slate-100 hover:border-indigo-900/10 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group bg-white">
      <div className={`w-16 h-16 ${color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function AIFeature({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-yellow-400"><Icon size={20} /></div>
      <div>
        <h5 className="font-bold text-lg mb-1">{title}</h5>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
