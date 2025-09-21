import GeminiService from "../services/geminiService";
import { ReportPeriod } from "../enums/reportPeriod";
import { UserIntent } from "../enums/userIntent";


class IdentifyUserIntentUsecase {
    constructor(private readonly geminiService: GeminiService) { }

    async execute(message: string): Promise<string> {

        const intents = Object.values(UserIntent);
        const periods = Object.values(ReportPeriod);
        const prompt = `
            Sua tarefa é identificar a intenção do usuário a partir de uma mensagem em português.
            A intenção pode ser uma de duas:
            1.  '${UserIntent.CREATE_EXPENSE}': Quando o usuário quer registrar um novo gasto.
            2.  '${UserIntent.REQUEST_REPORT}': Quando o usuário quer visualizar um relatório de despesas.

            Se a intenção for '${UserIntent.REQUEST_REPORT}', você também deve identificar o período do relatório, que deve ser um dos seguintes: '${periods.join("', '")}'.

            Responda APENAS e exclusivamente com um objeto JSON. Não adicione textos, explicações ou markdown.

            O formato de resposta deve ser um dos seguintes:
            - Para criação de despesa: { "intent": "${UserIntent.CREATE_EXPENSE}", "message": "a mensagem original do usuário" }
            - Para solicitar relatório: { "intent": "${UserIntent.REQUEST_REPORT}", "period": "PERIODO" }

            ---
            EXEMPLOS:

            Mensagem: "gastei 50 reais no ifood"
            Resultado: { "intent": "CREATE_EXPENSE", "message": "gastei 50 reais no ifood" }

            Mensagem: "me mostra o relatório de hoje"
            Resultado: { "intent": "REQUEST_REPORT", "period": "DIARIO" }

            Mensagem: "queria ver minhas despesas da semana"
            Resultado: { "intent": "REQUEST_REPORT", "period": "SEMANAL" }
            
            Mensagem: "relatorio mensal"
            Resultado: { "intent": "REQUEST_REPORT", "period": "MENSAL" }

            Mensagem: "lança 15 de uber"
            Resultado: { "intent": "CREATE_EXPENSE", "message": "lança 15 de uber" }

            Mensagem: "como foram meus gastos esse mês?"
            Resultado: { "intent": "REQUEST_REPORT", "period": "MENSAL" }
            ---

            AGORA, ANALISE A SEGUINTE MENSAGEM REAL:

            Mensagem: "${message}"
            Resultado:`;

        try {
            const result = await this.geminiService.generateContent(prompt);
            return result.replace(/```json/g, '').replace(/```/g, '').trim();
        } catch (error) {
            console.error('Erro ao executar IdentifyUserIntentUsecase:', error);
            return JSON.stringify({ error: 'Não foi possível identificar a intenção.' });
        }
    }
}

export default IdentifyUserIntentUsecase;