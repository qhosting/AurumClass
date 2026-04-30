import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Search, Trash2, Edit3, TrendingUp } from 'lucide-react';

export default function GradesView() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', title: '', value: '', comments: '' });

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    setLoading(true);
    // Fetch students and grades for this course
    Promise.all([
      fetch(`/api/courses/${course.id}/students`).then(res => res.json()),
      fetch(`/api/courses/${course.id}/grades`).then(res => res.json())
    ]).then(([studentsData, gradesData]) => {
      setStudents(studentsData);
      setGrades(gradesData);
    }).finally(() => setLoading(false));
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, courseId: selectedCourse.id, value: parseFloat(formData.value) }),
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({ studentId: '', title: '', value: '', comments: '' });
        handleSelectCourse(selectedCourse);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedCourse) {
    return (
      <div className="p-4">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Boletín de Calificaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <button key={course.id} onClick={() => handleSelectCourse(course)} className="p-8 bg-white rounded-[40px] border border-slate-100 custom-shadow text-left hover:border-indigo-900/10 hover:translate-y-[-4px] transition-all group">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <ClipboardList size={24} />
               </div>
               <h4 className="font-bold text-slate-800 text-lg mb-2">{course.name}</h4>
               <p className="text-slate-400 text-sm mb-6">{course.teacher?.name || 'Docente'}</p>
               <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">Gestionar notas</div>
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
           <button onClick={() => setSelectedCourse(null)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400">
              <Plus className="rotate-45" size={20} />
           </button>
           <h2 className="text-3xl font-black text-slate-900">Notas: {selectedCourse.name}</h2>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-6 py-2.5 bg-indigo-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2">
          <Plus size={18} /> Registrar Calificación
        </button>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 custom-shadow overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-slate-50">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumno</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nota</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fecha</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {grades.map(grade => (
                  <tr key={grade.id} className="hover:bg-slate-50">
                     <td className="px-10 py-6 font-bold">{grade.student?.name}</td>
                     <td className="px-10 py-6 text-sm text-slate-500 font-medium">{grade.title}</td>
                     <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1 rounded-lg font-black text-sm ${grade.value >= 7 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                           {grade.value.toFixed(1)}
                        </span>
                     </td>
                     <td className="px-10 py-6 text-right text-xs text-slate-400 font-bold">{new Date(grade.date).toLocaleDateString()}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {showAdd && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[48px] p-12 w-full max-w-lg">
               <h3 className="text-2xl font-black mb-8">Nueva Calificación</h3>
               <form onSubmit={handleAddGrade} className="space-y-6">
                  <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm">
                     <option value="">Seleccionar Alumno</option>
                     {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input type="text" placeholder="Título de la Actividad" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" />
                  <input type="number" step="0.1" max="10" min="0" placeholder="Calificación (0-10)" required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" />
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancelar</button>
                     <button type="submit" className="flex-1 py-4 bg-indigo-900 text-white rounded-2xl font-bold">Guardar</button>
                  </div>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
}
