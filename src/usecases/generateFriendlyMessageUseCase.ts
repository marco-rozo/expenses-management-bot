import { GeminiActions } from '../enums/geminiActions';
import { Expense } from '../models/expenseModel';
import GeminiService from '../services/geminiService';

class GenerateFriendlyMessageUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(action: GeminiActions, expense: Partial<Expense>): Promise<string> {
    const { valor, categoria } = expense;

    const prompt = `
      Gere uma mensagem curta e amigável para o usuário sobre uma transação de despesa.
      A mensagem deve ser criativa e refletir o contexto da ação realizada.

      Contexto da Ação: ${action}
      Detalhes da Despesa:
      - Valor: R$ ${valor?.toFixed(2)}
      - Categoria: ${categoria}

      Seja criativo e evite mensagens genéricas. Por exemplo, se a categoria for "Lazer", 
      mencione algo sobre aproveitar a vida. Se for "Alimentação", pode falar sobre "matar a fome".
      A mensagem deve estar em português do Brasil.
    `;

    try {
      return await this.geminiService.generateContent(prompt, false);
    } catch (error) {
      console.error('Erro ao executar GenerateFriendlyMessageUseCase:', error);
      // Retorna uma mensagem padrão em caso de erro para não quebrar o fluxo principal
      return 'Operação realizada com sucesso!';
    }
  }
}

export default GenerateFriendlyMessageUseCase;
