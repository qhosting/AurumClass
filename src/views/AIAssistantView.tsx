import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Copy, RefreshCw, FileText, BookOpen, Lightbulb } from 'lucide-react';

export default function AIAssistantView() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.content);
    } catch (err) {
      setResult('Error al generar contenido. Por favor verifica tu API Key.');
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { icon: FileText, title: 'Plan de Clase', prompt: 'Genera un plan de clase para una lección de 60 minutos sobre...' },
    { icon: BookOpen, title: 'Resumen de Lectura', prompt: 'Resume los puntos clave del siguiente tema para alumnos de bachillerato...' },
    { icon: Lightbulb, title: 'Ideas de Tareas', prompt: 'Propón 5 ideas creativas de tareas prácticas para el tema de...' },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black tracking-widest uppercase mb-4">
          <Sparkles size={14} /> Desarrollado por Gemini 1.5 Flash
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2">Aurum AI Assistant</h2>
        <p className="text-slate-400 text-sm font-medium italic">Tu co-piloto pedagógico para crear contenido educativo de excelencia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {templates.map((t, i) => (
          <button 
            key={i}
            onClick={() => setPrompt(t.prompt)}
            className="p-6 bg-white rounded-[32px] border border-slate-100 custom-shadow text-left hover:border-indigo-900/10 hover:translate-y-[-4px] transition-all group"
          >
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <t.icon size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{t.title}</h4>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 custom-shadow overflow-hidden">
        <form onSubmit={handleGenerate} className="p-8 border-b border-slate-50">
          <div className="relative group">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="¿En qué puedo ayudarte hoy? Ej: Genera un examen de 10 preguntas sobre la Revolución Mexicana."
              className="w-full min-h-[150px] p-8 bg-slate-50 rounded-[32px] border-none outline-none focus:ring-2 focus:ring-indigo-900/10 text-sm font-medium resize-none placeholder:text-slate-300"
            />
            <button 
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-6 right-6 p-4 bg-indigo-900 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <RefreshCw size={24} className="animate-spin" /> : <Send size={24} />}
            </button>
          </div>
        </form>

        <div className="p-8 bg-slate-50/50 min-h-[300px] relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
              >
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-900 transition-colors"
                  >
                    <Copy size={14} /> COPIAR CONTENIDO
                  </button>
                </div>
                <div className="whitespace-pre-wrap font-medium">{result}</div>
              </motion.div>
            ) : (
              <div key="empty" className="flex flex-col items-center justify-center h-[200px] text-slate-300">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-sm italic">Esperando tu instrucción...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
