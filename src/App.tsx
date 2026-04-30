import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  MonitorPlay, 
  Users,
  GraduationCap,
  CreditCard, 
  Settings, 
  Bell, 
  Search, 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Calendar,
  MoreVertical,
  Share2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LandingView from './views/LandingView.js';
import LoginView from './views/LoginView.js';
import UsersView from './views/UsersView.js';
import AIAssistantView from './views/AIAssistantView.js';
import AttendanceView from './views/AttendanceView.js';
import GradesView from './views/GradesView.js';
import QRAttendanceView from './views/QRAttendanceView.js';
import { subscribeToNotifications } from './pwa.js';

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [googleCourses, setGoogleCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  useEffect(() => {
    // Check for existing session
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setView('app');
          subscribeToNotifications();
        }
      })
      .catch(() => {});

    // Check for OAuth2 success redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      // Small delay to ensure cookies are set/processed
      setTimeout(() => {
        fetch('/api/auth/me')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setUser(data.user);
              setView('app');
              subscribeToNotifications();
              // Clean URL
              window.history.replaceState({}, document.title, "/");
            }
          });
      }, 500);
    }

    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error fetching local courses:', err));

    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const fetchGoogleCourses = () => {
    setLoadingGoogle(true);
    fetch('/api/google/courses')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setGoogleCourses(data);
      })
      .catch(err => console.error('Error fetching Google courses:', err))
      .finally(() => setLoadingGoogle(false));
  };

  useEffect(() => {
    if (activeTab === 'google-class' && googleCourses.length === 0) {
      fetchGoogleCourses();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMainView stats={stats} userName={user?.name || 'Admin'} courses={courses} events={events} />;
      case 'google-class':
        return (
          <GoogleClassroomView 
            courses={googleCourses} 
            loading={loadingGoogle} 
            onRefresh={fetchGoogleCourses} 
            isLinked={!!user?.googleRefreshToken}
          />
        );
      case 'students':
        return <UsersView role="STUDENT" />;
      case 'teachers':
        return <UsersView role="TEACHER" />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'attendance':
        return <AttendanceView />;
      case 'grades':
        return <GradesView />;
      case 'qr-attendance':
        return <QRAttendanceView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-300">
            <BookOpen size={64} className="mb-4 opacity-20" />
            <h3 className="text-xl font-bold">Módulo {activeTab}</h3>
            <p className="text-sm">Esta sección está siendo procesada para el entorno universitario.</p>
          </div>
        );
    }
  };

  if (view === 'landing') {
    return <LandingView onStart={() => setView('login')} />;
  }

  if (view === 'login') {
    return (
      <LoginView 
        onLoginSuccess={(userData) => {
          setUser(userData);
          setView('app');
        }} 
        onBack={() => setView('landing')} 
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F7FE] font-sans selection:bg-yellow-200">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 flex flex-col bg-white px-6 py-8 border-r border-slate-100 shrink-0">
        <div className="flex items-center gap-2 mb-12 px-2">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-indigo-900 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-indigo-900 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800 uppercase">AurumClass</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={FolderOpen} label="Académico" active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} />
          <NavItem icon={Users} label="Estudiantes" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
          <NavItem icon={FolderOpen} label="Cursos" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <NavItem icon={Sparkles} label="Aurum AI" active={activeTab === 'ai-assistant'} onClick={() => setActiveTab('ai-assistant')} />
          <NavItem icon={MonitorPlay} label="Classroom" active={activeTab === 'google-class'} onClick={() => setActiveTab('google-class')} />
          <NavItem icon={Users} label="Asistencia" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <NavItem icon={QrCode} label="Asistencia QR" active={activeTab === 'qr-attendance'} onClick={() => setActiveTab('qr-attendance')} />
          <NavItem icon={ClipboardList} label="Calificaciones" active={activeTab === 'grades'} onClick={() => setActiveTab('grades')} />
          <NavItem icon={CreditCard} label="Pagos y Becas" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <NavItem icon={MessageSquare} label="Mensajes" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} badge="3" />
          <NavItem icon={Settings} label="Configuración" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        {/* Help Center Card */}
        <div className="mt-auto bg-[#1A1A2E] rounded-[32px] p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 z-10">
            <HelpCircle size={20} />
          </div>
          <h4 className="text-white font-bold text-lg mb-1">Centro de ayuda</h4>
          <p className="text-slate-400 text-xs mb-4 leading-relaxed">¿Tienes algún problema? ¡Contáctanos!</p>
          <button className="w-full py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-yellow-400 transition-colors">
            Ir al centro de ayuda
          </button>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="flex-1 overflow-y-auto px-8 py-8 flex flex-col bg-white/50 backdrop-blur-sm rounded-[48px] my-4 mr-4 custom-shadow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-8"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* RIGHT UTILITY BAR */}
      <aside className="w-80 flex flex-col px-6 py-8 gap-8 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-800">Mi Perfil</h3>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Settings size={18} /></button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-indigo-500 overflow-hidden mb-4 shadow-xl">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} className="w-full h-full object-cover rounded-full" alt="" />
          </div>
          <h4 className="text-xl font-extrabold text-slate-800">{user?.name || 'AurumClass Admin'}</h4>
          <p className="text-slate-400 text-xs mt-1">{user?.email || 'admin@aurumclass.pro'}</p>
        </div>

        {/* Small Calendar Widget */}
        <div className="bg-[#F8FAFC] rounded-[32px] p-6 border border-slate-100">
           <div className="flex items-center justify-between mb-4">
             <button className="p-1 text-slate-400 hover:text-slate-800"><ChevronLeft size={16} /></button>
             <span className="text-sm font-bold text-slate-800">Mayo 2026</span>
             <button className="p-1 text-slate-400 hover:text-slate-800"><ChevronRight size={16} /></button>
           </div>
           <div className="grid grid-cols-7 gap-2 text-center">
             {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'].map(d => (
               <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
             ))}
             {[26, 27, 28, 29, 30, 1, 2].map((day, i) => (
               <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                 day === 29 ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-200'
               }`}>
                 {day}
               </button>
             ))}
           </div>
        </div>

        {/* Schedule */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-slate-800">Agenda Hoy</h4>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Ver todo</button>
          </div>
          <div className="space-y-4">
            <ScheduleItem time="10:00" title="Reunión Docentes" desc="Nuevos Lineamientos" color="#FEFBCB" />
            <ScheduleItem time="14:30" title="Auditoría Sistemas" desc="Mantenimiento PWA" color="#FFF9E5" />
          </div>
        </section>

        {/* Reminders */}
        <section>
          <h4 className="font-extrabold text-slate-800 mb-4">Recordatorios</h4>
          <div className="bg-[#EFFAFF] p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
               <MessageSquare size={18} />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-800">Actas - Envío Final</p>
               <p className="text-[10px] text-slate-400 mt-0.5">Viernes, 29 de Mayo</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

function DashboardMainView({ stats, userName, courses }: any) {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Hola, {userName} 👋</h2>
          <p className="text-slate-400 text-sm mt-1">¡Vamos a gestionar el éxito académico hoy!</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumnos</span>
              <span className="text-lg font-black text-indigo-900">{stats.students}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Docentes</span>
              <span className="text-lg font-black text-indigo-900">{stats.teachers}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cursos</span>
              <span className="text-lg font-black text-indigo-900">{stats.courses}</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-white rounded-2xl px-4 py-2 border border-slate-100 shadow-sm w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar alumnos, actas, pagos..." 
              className="bg-transparent border-none outline-none text-sm ml-3 w-full"
            />
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm hover:text-slate-600 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-slate-800">Cursos Recientes</h3>
            <button className="text-indigo-900 font-bold text-sm hover:underline flex items-center gap-1">
              Ver todo <ArrowRight size={14} />
            </button>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course: any) => (
                <CourseCard 
                  key={course.id}
                  title={course.name}
                  teacher={course.teacher?.name || 'Docente'}
                  progress={0}
                  students={0}
                  accentColor="#4F46E5"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[48px] border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-4">
                  <LayoutDashboard size={32} />
               </div>
               <p className="text-slate-400 font-bold">No hay cursos registrados aún.</p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-8">Eventos Institucionales</h3>
          <div className="space-y-6">
            {events.map((event: any) => (
              <ScheduleItem 
                key={event.id}
                time={new Date(event.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                title={event.title}
                desc={event.description}
                color={event.type === 'SUCCESS' ? '#ECFDF5' : '#F8FAFC'}
              />
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <button className="flex items-center gap-1 text-slate-400 text-sm font-bold">Hoy <ChevronDown size={14} /></button>
            <button className="text-yellow-600 text-sm font-bold">+ Nueva Alerta</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A2E] rounded-[32px] p-8 text-white relative">
             <div className="absolute top-8 right-8 px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold tracking-widest text-yellow-400 border border-white/20">URGENTE</div>
             <h4 className="text-xl font-bold mb-4">Cierre de Actas 2026-I</h4>
             <p className="text-slate-400 text-xs leading-relaxed mb-6">Verificar la carga de notas finales de los profesores de Ingeniería antes del viernes.</p>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                 <Calendar size={14} /> Límite: 29.06.2024
               </div>
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1A2E] bg-slate-700 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="" />
                   </div>
                 ))}
               </div>
             </div>
          </div>
          <div className="bg-[#FDE047] rounded-[32px] p-8 text-slate-900 relative">
             <div className="absolute top-8 right-8 px-3 py-1 bg-black/5 rounded-lg text-[10px] font-bold tracking-widest text-slate-600 border border-black/10">PENDIENTE</div>
             <h4 className="text-xl font-bold mb-4">Auditoría Pagos Mayo</h4>
             <p className="text-slate-700/70 text-xs leading-relaxed mb-6">Revisión de 45 becas académicas con pagos irregulares registrados esta semana.</p>
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                 <Calendar size={14} /> Próxima reunión: 15.07.2024
               </div>
               <div className="flex -space-x-2">
                 {[4,5,6].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-[#FDE047] bg-slate-100 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i+15}`} alt="" />
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GoogleClassroomView({ courses, loading, onRefresh, isLinked }: any) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Google Classroom</h2>
          <p className="text-slate-400 text-sm mt-1">Sincronización en tiempo real con tus cursos de Google.</p>
        </div>
        {isLinked && (
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-800 disabled:opacity-50 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Actualizar Sincronización
          </button>
        )}
      </div>

      {!isLinked ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[64px] shadow-2xl shadow-indigo-100 border border-slate-50 text-center">
           <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[40px] flex items-center justify-center mb-8">
              <MonitorPlay size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-4">No has vinculado tu cuenta</h3>
           <p className="text-slate-500 max-w-sm mb-10 font-medium">Vincula tu cuenta institucional de Google para acceder a tus cursos de Classroom directamente desde AurumClass.</p>
           <button 
              onClick={async () => {
                const res = await fetch('/api/auth/google/url');
                const { url } = await res.json();
                window.location.href = url;
              }}
              className="px-10 py-5 bg-indigo-900 text-white rounded-3xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl shadow-indigo-200"
           >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
              Vincular Google Classroom
           </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 custom-shadow flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-yellow-400/10 text-yellow-600 rounded-3xl flex items-center justify-center mb-6">
                <Users size={32} />
             </div>
             <h4 className="font-bold text-lg">Importar Alumnos</h4>
             <p className="text-xs text-slate-400 mt-2">Trae automáticamente todos tus contactos de clase.</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 custom-shadow flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-emerald-400/10 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                <ClipboardList size={32} />
             </div>
             <h4 className="font-bold text-lg">Sincronizar Notas</h4>
             <p className="text-xs text-slate-400 mt-2">Las calificaciones de Google pasan directo al boletín.</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 custom-shadow flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-indigo-400/10 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
                <Calendar size={32} />
             </div>
             <h4 className="font-bold text-lg">Agenda Compartida</h4>
             <p className="text-xs text-slate-400 mt-2">Calendario académico y de clase unificados.</p>
          </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
        active 
          ? 'bg-yellow-400 text-slate-900 shadow-xl shadow-yellow-100' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      {active && <div className="absolute left-0 w-1.5 h-6 bg-indigo-900 rounded-r-lg" />}
      <Icon size={20} className={active ? 'text-slate-900' : 'group-hover:text-slate-800'} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {badge && (
        <span className="ml-auto w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">
          {badge}
        </span>
      )}
    </button>
  );
}

function CourseCard({ title, teacher, progress, students, accentColor }: any) {
  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 custom-shadow hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
           <LayoutDashboard className="text-slate-300" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 truncate">{title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{teacher}</p>
        </div>
        <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1.5 grayscale opacity-50">
           <Users size={14} /> <span className="text-[10px] font-black">{students} Alumnos</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-500" style={{ width: `${progress || 0}%`, backgroundColor: accentColor }} />
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold">
           <span className="text-slate-400">Progreso: <span className="text-slate-800">{progress || 0}%</span></span>
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ time, title, desc, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[11px] font-black text-slate-800 w-12">{time}</span>
      <div className="flex-1 p-4 rounded-2xl border-l-[6px] shadow-sm flex flex-col justify-center" style={{ backgroundColor: color, borderLeftColor: '#1A1A2E' }}>
         <h5 className="font-bold text-xs text-slate-800">{title}</h5>
         <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

const ChevronDown = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
