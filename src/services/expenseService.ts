
import { Expense } from '../models/expenseModel';
import { v4 as uuidv4 } from 'uuid';
import * as expenseDatasource from '../datasources/expenseDatasource';

export const createExpense = async (expenseData: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const newExpense: Expense = {
        ...expenseData,
        _id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return await expenseDatasource.create(newExpense);
};

export const getExpenses = async (): Promise<Expense[]> => {
    return await expenseDatasource.getAll();
};

export const getExpenseById = async (id: string): Promise<Expense | null> => {
    return await expenseDatasource.getById(id);
};

export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<void> => {
    const updatesWithTimestamp = {
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    await expenseDatasource.update(id, updatesWithTimestamp);
};

export const deleteExpense = async (id: string): Promise<void> => {
    await expenseDatasource.remove(id);
};
