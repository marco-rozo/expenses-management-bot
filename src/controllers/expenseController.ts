
import { Request, Response } from 'express';
import * as expenseService from '../services/expenseService';
import { generateExpenseMessage, GeminiAction } from '../services/geminiService';
import { Expense } from '../models/expenseModel';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expenseData: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'> = req.body;
    
    // Cria a despesa
    const newExpenseId = await expenseService.createExpense(expenseData);

    // Gera a mensagem personalizada
    const geminiMessage = await generateExpenseMessage(GeminiAction.CRIADO, { 
        ...expenseData, 
        _id: newExpenseId 
    });

    res.status(201).json({ message: geminiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar despesa' });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await expenseService.getExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar despesas' });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);
        if (expense) {
            res.status(200).json(expense);
        } else {
            res.status(404).json({ message: 'Despesa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar despesa' });
    }
};


export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expenseData: Partial<Expense> = req.body;
    await expenseService.updateExpense(req.params.id, expenseData);

    // Pega os dados atualizados para gerar a mensagem
    const updatedExpense = await expenseService.getExpenseById(req.params.id);

    const geminiMessage = await generateExpenseMessage(GeminiAction.ATUALIZADO, updatedExpense!);
    
    res.status(200).json({ message: geminiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar despesa' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    // Pega os dados da despesa ANTES de deletar
    const expenseToDelete = await expenseService.getExpenseById(req.params.id);
    if (!expenseToDelete) {
        return res.status(404).json({ message: 'Despesa não encontrada para deletar' });
    }

    await expenseService.deleteExpense(req.params.id);

    const geminiMessage = await generateExpenseMessage(GeminiAction.DELETADO, expenseToDelete);

    res.status(200).json({ message: geminiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar despesa' });
  }
};
