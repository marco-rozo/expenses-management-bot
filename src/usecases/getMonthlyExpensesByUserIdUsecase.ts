import { Expense } from "../models/expenseModel";
import ExpenseService from "../services/expenseService";

class GetMonthlyExpensesByUserIdUsecase {
    constructor(private expenseService: ExpenseService) {}

    async execute(userId: string): Promise<Expense[]> {
        const startOfDay = new Date();
        startOfDay.setDate(1);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setMonth(endOfDay.getMonth() + 1);
        endOfDay.setDate(0);
        endOfDay.setHours(23, 59, 59, 999);
        return this.expenseService.getExpensesByUserIdAndDateRange(userId, startOfDay, endOfDay);
    }
}

export default GetMonthlyExpensesByUserIdUsecase;