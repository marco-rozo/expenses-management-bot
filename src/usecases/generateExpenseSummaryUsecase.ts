import { SummaryByCategory } from '../interfaces/summaryByCategory';
import { Expense } from '../models/expenseModel';
import GeminiService from '../services/geminiService';

class GenerateExpenseSummaryUsecase {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(expenses: Expense[]): Promise<string> {
    if (!expenses || expenses.length === 0) {
      return 'Você ainda não tem despesas para analisar. Que tal começar a registrar seus gastos?';
    }

    const summaryByCategory: SummaryByCategory = expenses.reduce((acc, expense) => {
      acc[expense.categoria] = (acc[expense.categoria] || 0) + expense.valor;
      return acc;
    }, {} as SummaryByCategory);

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.valor, 0);

    const topCategory = Object.entries(summaryByCategory).reduce(
      (top, [name, total]) => (total > top.total ? { name, total } : top),
      { name: '', total: 0 }
    );

    const prompt = `
      Sua tarefa é atuar como um conselheiro financeiro amigável e gerar uma mensagem curta e descontraída analisando o resumo de despesas de um usuário.
      A mensagem deve interpretar os dados, dar um insight rápido sobre os hábitos de consumo e ser encorajadora. Não use um tom de bronca.

      DADOS PARA ANÁLISE:
      - Gasto Total: R$ ${totalExpenses.toFixed(2)}
      - Categoria com Mais Gastos: "${topCategory.name}" (total de R$ ${topCategory.total.toFixed(2)})
      - Resumo de Gastos por Categoria: ${JSON.stringify(summaryByCategory)}

      INSTRUÇÕES PARA A MENSAGEM:
      - Gere APENAS a mensagem criativa e amigável. Não adicione cabeçalhos, títulos ou a palavra "mensagem".
      - A mensagem deve ter no máximo duas frases.
      - Use emojis para deixar o texto mais leve.

      EXEMPLO DE RESPOSTA ESPERADA:
      "Uau, parece que o foco do seu mês foi em boa comida! 🍕 Seus gastos com ${topCategory.name} lideraram o ranking. Continue registrando para manter tudo sob controle! 😉"

      AGORA, GERE A MENSAGEM PARA OS DADOS FORNECIDOS:
    `;
    
    let friendlyMessage = `Análise completa! Sua principal categoria de gastos foi ${topCategory.name}.`;
    try {
      const geminiResponse = await this.geminiService.generateContent(prompt);
      friendlyMessage = geminiResponse.replace(/`/g, '').trim();
    } catch (error) {
      console.error('Erro ao gerar a mensagem amigável:', error);
    }

    const reportLines = [
        friendlyMessage.replace(/[\[\]"]/g, '').trim(),
      '\n',
      '📊 *Resumo do Período*',
      `💰 *Gasto Total:* R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `🏆 *Categoria Destaque:* ${topCategory.name}`,
      '\n*Detalhes por Categoria:*'
    ];
    
    Object.entries(summaryByCategory)
      .sort(([, a], [, b]) => b - a) // Ordena as categorias da mais gasta para a menos gasta
      .forEach(([category, total]) => {
        const formattedTotal = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        reportLines.push(`- ${category}: R$ ${formattedTotal}`);
      });

    return reportLines.join('\n');
  }
}

export default GenerateExpenseSummaryUsecase;