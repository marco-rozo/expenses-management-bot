import { GeminiActions } from '../enums/geminiActions';
import { Expense } from '../models/expenseModel';
import GeminiService from '../services/geminiService';

class GenerateFriendlyMessageUseCase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(action: GeminiActions, expense: Partial<Expense>): Promise<string> {
    const { valor, categoria, originalMessage } = expense;
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const prompt = `
      Sua tarefa é gerar uma mensagem de confirmação de despesa formatada em 4 linhas para um aplicativo de finanças.
      A mensagem deve ser amigável, criativa e usar emojis.
      Sua resposta DEVE SEGUIR ESTRITAMENTE o seguinte formato, sem adicionar textos extras, markdown ou qualquer outra formatação.

      Linha 1: ✅ Informação registrada!
      Linha 2: [Sua mensagem criativa e contextual aqui]
      Linha 3: [emoji da categoria] [categoria em mainúsculas]
      Linha 4: 💰 [Valor formatado como R$XX,XX]
      Linha 5: 📅 [Data da transação]

      ---
      EXEMPLO DE COMO FAZER:

      # DADOS DE ENTRADA DO EXEMPLO:
      - Ação: Despesa Criada
      - Valor: 45.00
      - Categoria: Alimentação
      - Mensagem Original do Usuário: "iFood"
      - Data: 21/09/2025

      # RESPOSTA ESPERADA PARA O EXEMPLO:
      ✅ Informação registrada!
      🍔 Hummm, R$45 investidos pra matar aquela larica no iFood! 😋 Bom apetite! 🍕
      🍔 ALIMENTAÇÃO
      💰 R$45,00
      📅 21/09/2025
      ---

      NÂO GERE NADA ALEM DAS 5 LINHAS ACIMA. 

      AGORA, GERE A MENSAGEM PARA OS SEGUINTES DADOS REAIS:

      # DADOS REAIS:
      - Ação: ${action}
      - Valor: ${valor?.toFixed(2)}
      - Categoria: ${categoria}
      - Mensagem Original do Usuário: "${originalMessage}"
      - Data: ${currentDate}
    `;

    try {
      const response = await this.geminiService.generateContent(prompt, false);
      return response.replace(/`/g, '');
    } catch (error) {
      console.error('Erro ao executar GenerateFriendlyMessageUseCase:', error);
      return `✅ Operação realizada!\n💰 R$${valor?.toFixed(2)}\n📅 ${currentDate}`;
    }
  }
}

export default GenerateFriendlyMessageUseCase;
