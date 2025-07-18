
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from '../models/expenseModel';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function generateExpenseMessage(action: GeminiAction, expense: Partial<Expense>): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const { valor, categoria, descricao } = expense;

  const prompt = `
    Gere uma mensagem curta e amigável para o usuário sobre uma transação de despesa.
    A mensagem deve ser criativa e refletir o contexto da ação realizada.

    Contexto da Ação: ${action}
    Detalhes da Despesa:
    - Valor: R$ ${valor?.toFixed(2)}
    - Categoria: ${categoria}
    - Descrição: ${descricao}

    Seja criativo e evite mensagens genéricas. Por exemplo, se a categoria for "Lazer", 
    mencione algo sobre aproveitar a vida. Se for "Alimentação", pode falar sobre "matar a fome".
    A mensagem deve estar em português do Brasil.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Erro ao gerar mensagem com o Gemini:', error);
    // Retorna uma mensagem padrão em caso de erro
    return 'Operação realizada com sucesso!';
  }
}
