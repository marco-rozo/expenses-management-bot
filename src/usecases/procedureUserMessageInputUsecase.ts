import { FormatMessage } from "../enums/formatMessage";
import { UserIntent } from "../enums/userIntent";
import { InputMessage } from "../interfaces/inputMessage";
import { ResponseProcedureOutput } from "../interfaces/responseProcedureOutput";
import { isAudioFile } from "../utils/isAudioFile";
import IdentifyUserIntentUsecase from "./identifyInputUserUsecase";
import TranscribeAudioUsecase from "./transcribeAudioUsecase";
import CreateExpenseFromMessageUsecase from "./createExpenseFromMessageUsecase";
import GenerateExpenseSummaryUsecase from "./generateExpenseSummaryUsecase";
import { Expense } from "../models/expenseModel";
import GetMonthlyExpensesByUserIdUsecase from "./getMonthlyExpensesByUserIdUsecase";
import GetTodayExpensesByUserIdUsecase from "./getTodayExpensesByUserIdUsecase";
import { ReportPeriod } from "../enums/reportPeriod";

class ProcedureUserMessageInputUsecase {
    constructor(
        private transcribeAudioUsecase: TranscribeAudioUsecase,
        private identifyUserIntentUsecase: IdentifyUserIntentUsecase,
        private createExpenseFromMessageUsecase: CreateExpenseFromMessageUsecase,
        private generateExpenseSummaryUsecase: GenerateExpenseSummaryUsecase,
        private getMonthlyExpensesByUserIdUsecase: GetMonthlyExpensesByUserIdUsecase,
        private getTodayExpensesByUserIdUsecase: GetTodayExpensesByUserIdUsecase,
    ) { }

    async execute(input: InputMessage): Promise<ResponseProcedureOutput> {
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
            const response = await this.identifyUserIntentUsecase.execute(processedText);
            if (typeof response === 'string') {
                const userIntentByGemini = JSON.parse(response);

                if (userIntentByGemini.intent === UserIntent.CREATE_EXPENSE) {
                    const createExpenseInput = {
                        message,
                        processedText,
                        format,
                    };

                    return await this.createExpenseFromMessageUsecase.execute(createExpenseInput);
                } else if (userIntentByGemini.intent === UserIntent.REQUEST_REPORT) {
                    const expensesList: Expense[] = [];

                    if (userIntentByGemini.period === ReportPeriod.MENSAL) {
                        const monthlyExpenses = await this.getMonthlyExpensesByUserIdUsecase.execute(message.from);
                        if (monthlyExpenses && monthlyExpenses.length > 0) {
                            expensesList.push(...monthlyExpenses);
                        }
                    } else if (userIntentByGemini.period === ReportPeriod.DIARIO) {
                        const todayExpenses = await this.getTodayExpensesByUserIdUsecase.execute(message.from);
                        if (todayExpenses && todayExpenses.length > 0) {
                            expensesList.push(...todayExpenses);
                        }
                    }

                    const response = await this.generateExpenseSummaryUsecase.execute(expensesList);

                    return {
                        success: true,
                        replyMessage: response,
                    };
                } else {
                    return {
                        success: false,
                        replyMessage: 'Não foi possível identificar a intenção do usuário. Tente novamente.',
                    };
                }
            }

        } catch (error) {
            return {
                success: false,
                replyMessage: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
            };
        }
    }
}

export default ProcedureUserMessageInputUsecase;