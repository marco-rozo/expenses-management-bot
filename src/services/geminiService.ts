
import {GoogleGenAI} from '@google/genai';
import 'dotenv/config'

class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});
  }

  async generateContent(prompt: string, isJson:boolean = true): Promise<string> {
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
        config: {
          responseMimeType: isJson ? 'application/json' : 'text/plain',
        }
      });
      return response.text.trim();
    } catch (error) {
      console.error('Erro ao gerar conteúdo com o Gemini:', error);
      // Lançar o erro para que o chamador possa tratá-lo
      throw new Error('Falha ao gerar conteúdo com o serviço Gemini.');
    }
  }
}

export default GeminiService;
