import { GeminiActions } from "../enums/geminiActions";
import { Category, Expense } from "../models/expenseModel";
import { normalizeCategory } from "../utils/categoryNormalizer";
import IdentifyExpenseByMessageUsecase from "./identifyExpenseByMessageUsecase";
import GenerateFriendlyMessageUseCase from "./generateFriendlyMessageUseCase";
import ExpenseService from "../services/expenseService";
import { ResponseProcedureOutput } from "../interfaces/responseProcedureOutput";
import { CreateExpenseInput } from "../interfaces/createExpenseInput";
class CreateExpenseFromMessageUsecase {
    constructor(
        private generateFriendlyMessageUsecase: GenerateFriendlyMessageUseCase,
        private identifyExpenseByMessageUsecase: IdentifyExpenseByMessageUsecase,
        private expenseService: ExpenseService,
    ) { }

    async execute(inputUser: CreateExpenseInput): Promise<ResponseProcedureOutput> {
        const { processedText, format, message } = inputUser;
        try {
            const response = await this.identifyExpenseByMessageUsecase.execute(processedText);

            if (typeof response === 'string') {
                const expenseByGemini = JSON.parse(response);

                console.log('Resposta do Gemini:', expenseByGemini);

                if (expenseByGemini && expenseByGemini.valor && expenseByGemini.categoria) {
                    const expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
                        valor: parseFloat(expenseByGemini.valor),
                        categoria: normalizeCategory(expenseByGemini.categoria as any) || Category.OUTROS,
                        originalMessage: processedText,
                        formatMessage: format,
                        userId: message.from,
                    };

                    await this.expenseService.createExpense(expenseData)

                    const geminiMessage = await this.generateFriendlyMessageUsecase.execute(GeminiActions.CREATE, expenseData);
                    return {
                        success: true,
                        replyMessage: `${geminiMessage}`,
                    };
                }
            }
            return {
                success: false,
                replyMessage: 'Não conseguimos identificar o gasto. Por favor, tente novamente.',
            };

        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            return {
                success: false,
                replyMessage: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
            };
        }
    }
}

export default CreateExpenseFromMessageUsecase;
