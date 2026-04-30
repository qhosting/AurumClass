import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Clock, Save, Users, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

export default function AttendanceView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    setLoading(true);
    fetch(`/api/courses/${course.id}/students`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        const initialAttendance: Record<string, string> = {};
        data.forEach((s: any) => initialAttendance[s.id] = 'PRESENT');
        setAttendance(initialAttendance);
      })
      .finally(() => setLoading(false));
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          date: new Date().toISOString(),
          records: Object.entries(attendance).map(([userId, status]) => ({ userId, status }))
        }),
      });
      alert('Asistencia guardada correctamente');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedCourse) {
    return (
      <div className="p-4">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Pase de Lista</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <button 
              key={course.id}
              onClick={() => handleSelectCourse(course)}
              className="p-8 bg-white rounded-[40px] border border-slate-100 custom-shadow text-left hover:border-indigo-900/10 hover:translate-y-[-4px] transition-all group"
            >
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users size={24} />
               </div>
               <h4 className="font-bold text-slate-800 text-lg mb-2">{course.name}</h4>
               <p className="text-slate-400 text-sm font-medium mb-6">{course.teacher?.name || 'Sin docente asignado'}</p>
               <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  Seleccionar curso <ChevronRight size={14} />
               </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
           <button onClick={() => setSelectedCourse(null)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-800 transition-colors">
              <ChevronRight size={20} className="rotate-180" />
           </button>
           <div>
              <h2 className="text-3xl font-black text-slate-900">{selectedCourse.name}</h2>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                 <CalendarIcon size={14} /> {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
           </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3.5 bg-indigo-900 text-white rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-indigo-800 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
          Guardar Asistencia
        </button>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 custom-shadow overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-slate-50">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumno</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado de Asistencia</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-xs text-slate-400">
                              {student.name?.charAt(0)}
                           </div>
                           <span className="font-bold text-slate-800">{student.name}</span>
                        </div>
                     </td>
                     <td className="px-10 py-6">
                        <div className="flex items-center justify-center gap-3">
                           <button 
                              onClick={() => handleStatusChange(student.id, 'PRESENT')}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${attendance[student.id] === 'PRESENT' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                              <CheckCircle size={16} /> Presente
                           </button>
                           <button 
                              onClick={() => handleStatusChange(student.id, 'LATE')}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${attendance[student.id] === 'LATE' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                              <Clock size={16} /> Retardo
                           </button>
                           <button 
                              onClick={() => handleStatusChange(student.id, 'ABSENT')}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${attendance[student.id] === 'ABSENT' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                              <XCircle size={16} /> Falta
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
