
import ExpenseDatasource from '../datasources/expenseDatasource';
import { Expense } from '../models/expenseModel';
import { v4 as uuidv4 } from 'uuid';


class ExpenseService {
    constructor(
        private expenseDatasource: ExpenseDatasource,
    ) { }

    async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const newExpense: Expense = {
            ...expenseData,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return await this.expenseDatasource.create(newExpense);
    }

    async getExpenses(): Promise<Expense[]> {
        return await this.expenseDatasource.getAll();
    }

    async getExpenseById(id: string): Promise<Expense | null> {
        return await this.expenseDatasource.getById(id);
    }

    async getExpensesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]> {
        return await this.expenseDatasource.getExpensesByUserIdAndDateRange(userId, startDate, endDate);
    }

     async updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
        const updatesWithTimestamp = {
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        await this.expenseDatasource.update(id, updatesWithTimestamp);
    }

    async deleteExpense(id: string): Promise<void> {
        await this.expenseDatasource.remove(id);
    }
}

export default ExpenseService;
