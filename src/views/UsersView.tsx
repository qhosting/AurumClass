import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Search, Mail, Trash2, Filter } from 'lucide-react';

export default function UsersView({ role }: { role: 'STUDENT' | 'TEACHER' }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '' });

  const label = role === 'STUDENT' ? 'Alumnos' : 'Docentes';

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/users?role=${role}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({ email: '', name: '' });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900">{label}</h2>
          <p className="text-slate-400 text-sm mt-1">Gestión completa de {label.toLowerCase()} de la institución.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-2.5 bg-indigo-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={18} />
          Registrar {role === 'STUDENT' ? 'Alumno' : 'Docente'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 custom-shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total {label}</span>
            <span className="text-4xl font-black text-indigo-900">{users.length}</span>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 custom-shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Activos Hoy</span>
            <span className="text-4xl font-black text-emerald-500">{users.length}</span>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 custom-shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nuevos (Mes)</span>
            <span className="text-4xl font-black text-yellow-500">0</span>
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 custom-shadow overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl w-96 border border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder={`Buscar ${label.toLowerCase()}...`} className="bg-transparent border-none outline-none text-sm font-medium w-full" />
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex justify-center"><div className="w-8 h-8 border-4 border-indigo-900/10 border-t-indigo-900 rounded-full animate-spin" /></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">
                    No se encontraron registros.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-slate-800">{user.name || 'Sin nombre'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{user.email}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Activo</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
           <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[48px] p-12 w-full max-w-lg shadow-2xl"
           >
              <h3 className="text-2xl font-black text-slate-900 mb-8">Registrar Nuevo {role === 'STUDENT' ? 'Alumno' : 'Docente'}</h3>
              <form onSubmit={handleAddUser} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-900/10 text-sm font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-900/10 text-sm font-bold"
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowAdd(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-indigo-900 text-white rounded-2xl font-bold hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100"
                    >
                      Guardar
                    </button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}
