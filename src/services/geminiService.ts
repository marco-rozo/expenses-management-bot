
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName: string = 'gemini-1.5-flash';

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  }

  async generateContent(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Erro ao gerar conteúdo com o Gemini:', error);
      // Lançar o erro para que o chamador possa tratá-lo
      throw new Error('Falha ao gerar conteúdo com o serviço Gemini.');
    }
  }
}

export default GeminiService;
