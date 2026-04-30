import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generatePedagogicalContent = async (prompt: string) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const systemPrompt = `Eres Aurum AI, un asistente pedagógico experto. 
  Tu objetivo es ayudar a los profesores de AurumClass a generar contenido educativo de alta calidad.
  Responde siempre en español mexicano, con un tono profesional pero cercano y motivador.
  Genera contenido estructurado (puedes usar markdown).`;

  const result = await model.generateContent([systemPrompt, prompt]);
  const response = await result.response;
  return response.text();
};
