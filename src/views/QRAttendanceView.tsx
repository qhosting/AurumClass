import { useState } from 'react';
import { QrCode, Smartphone, CheckCircle2 } from 'lucide-react';

export default function QRAttendanceView() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
       <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Asistencia Inteligente</h2>
          <p className="text-slate-400 font-medium">Escanea para registrar tu entrada automáticamente.</p>
       </div>

       <div className="bg-white rounded-[64px] p-16 border border-slate-100 custom-shadow">
          {step === 1 ? (
             <>
                <div className="w-64 h-64 bg-slate-50 rounded-[48px] mx-auto mb-10 flex items-center justify-center border-4 border-indigo-900/5">
                   <QrCode size={180} className="text-indigo-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Código de Sesión Activo</h3>
                <p className="text-sm text-slate-400 mb-10 max-w-xs mx-auto">Este código es válido por los próximos 5 minutos para la clase de Matemáticas.</p>
                <button 
                   onClick={() => setStep(2)}
                   className="w-full py-5 bg-indigo-900 text-white rounded-3xl font-black text-lg shadow-2xl shadow-indigo-100 hover:scale-105 transition-all"
                >
                   Generar Nuevo Código
                </button>
             </>
          ) : (
             <div className="py-10">
                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                   <CheckCircle2 size={64} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">¡Listo para Recibir!</h3>
                <p className="text-slate-400 font-medium mb-10">Los alumnos ahora pueden escanear desde su PWA.</p>
                <button onClick={() => setStep(1)} className="text-indigo-900 font-black text-sm hover:underline">Volver al panel</button>
             </div>
          )}
       </div>

       <div className="grid grid-cols-2 gap-6 mt-12">
          <div className="p-8 bg-indigo-900 text-white rounded-[40px] text-left">
             <Smartphone size={32} className="mb-4 opacity-50" />
             <h4 className="font-bold text-lg mb-1">PWA Compatible</h4>
             <p className="text-xs text-indigo-100/60 font-medium">Funciona desde cualquier dispositivo móvil.</p>
          </div>
          <div className="p-8 bg-yellow-400 text-slate-900 rounded-[40px] text-left">
             <CheckCircle2 size={32} className="mb-4 opacity-50" />
             <h4 className="font-bold text-lg mb-1">Sync Real-Time</h4>
             <p className="text-xs text-slate-900/60 font-medium">Base de datos actualizada al instante.</p>
          </div>
       </div>
    </div>
  );
}
