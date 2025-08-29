import { Category } from '../models/expenseModel';
import GeminiService from '../services/geminiService';

class IdentifyExpenseByMessageUsecase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(message: string): Promise<string> {
    const categories = Object.keys(Category);
    const formattedCategories = categories.map(cat => `"${cat}"`).join(', ');

    const prompt = `Dada a seguinte mensagem em português: "${message}", identifique o valor do gasto e a categoria.
    A categoria deve ser uma das seguintes: ${formattedCategories}.
    Retorne a saída como um objeto JSON com as chaves "valor" (número) e "categoria" (string).
      Exemplos:

      Mensagem: Gastei 50 reais no supermercado
            Resultado: {valor: 50, categoria: supermercado}

      Mensagem: 387 conto no restaurante
            Resultado: {valor: 387, categoria: restaurante}

      Mensagem: 22 reais em comida
      Resultado: {valor: 22, categoria: supermercado}
     
      Responda APENAS e exclusivamente o JSON de resposta no seguinte formato:
      {
      "valor": NUMERO,
      "categoria": "CATEGORIA"
      }}`;

      try {
        const result = await this.geminiService.generateContent(prompt);
        console.log('Resposta do Gemini:', result);
        return result;
      } catch (error) {
        console.error('Erro ao executar GenerateFriendlyMessageUseCase:', error);
        // Retorna uma mensagem padrão em caso de erro para não quebrar o fluxo principal
        return 'Operação realizada com sucesso!';
      }
  }
}

export default IdentifyExpenseByMessageUsecase;
