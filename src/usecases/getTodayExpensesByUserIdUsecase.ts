import { Expense } from "../models/expenseModel";
import ExpenseService from "../services/expenseService";

class GetTodayExpensesByUserIdUsecase {
    constructor(private expenseService: ExpenseService) {}

    async execute(userId: string): Promise<Expense[]> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return this.expenseService.getExpensesByUserIdAndDateRange(userId, startOfDay, endOfDay);
    }
}

export default GetTodayExpensesByUserIdUsecase;