import WAWebJS from "whatsapp-web.js";

export interface CreateExpenseInput {
    message: WAWebJS.Message;
    processedText: string;
    format: string;
}