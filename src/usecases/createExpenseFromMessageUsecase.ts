import WAWebJS from "whatsapp-web.js";
import { FormatMessage } from "../enums/formatMessage";
import { GeminiActions } from "../enums/geminiActions";
import { Category, Expense } from "../models/expenseModel";
import { normalizeCategory } from "../utils/categoryNormalizer";
import { isAudioFile } from "../utils/isAudioFile";
import IdentifyExpenseByMessageUsecase from "./identifyExpenseByMessageUsecase";
import GenerateFriendlyMessageUseCase from "./generateFriendlyMessageUseCase";
import TranscribeAudioUsecase from "./transcribeAudioUsecase";
import ExpenseService from "../services/expenseService";

interface CreateExpenseOutput {
    success: boolean;
    replyMessage: string;
}

interface CreateExpenseInput {
    message: WAWebJS.Message;
}

class CreateExpenseFromMessageUsecase {
    constructor(
        private transcribeAudioUsecase: TranscribeAudioUsecase,
        private generateFriendlyMessageUsecase: GenerateFriendlyMessageUseCase,
        private identifyExpenseByMessageUsecase: IdentifyExpenseByMessageUsecase,
        private expenseService: ExpenseService,
    ) {}

    async execute(input: CreateExpenseInput): Promise<CreateExpenseOutput> {
        const { message } = input;

        try {
            let processedText: string | null = null;
            let format: FormatMessage = FormatMessage.TEXT;

            if (message.hasMedia) {
                const media = await message.downloadMedia();
                if (isAudioFile(media.mimetype)) {
                    const audioBase64 = media.data;
                    processedText = await this.transcribeAudioUsecase.execute(audioBase64);
                    format = FormatMessage.AUDIO;
                } else {
                    return {
                        success: false,
                        replyMessage: `Não identificamos o seu arquivo! Tente novamente com um áudio ou texto.`,
                    };
                }
            } else {
                processedText = message.body;
                format = FormatMessage.TEXT;
            }

            if (!processedText) {
                return {
                    success: false,
                    replyMessage: 'Não foi possível processar a mensagem (áudio vazio ou texto não identificado).',
                };
            }

            console.log(`Mensagem processada: ${processedText}`);

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
