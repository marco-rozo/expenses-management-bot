
import { Request, Response } from 'express';
import * as expenseService from '../services/expenseService';
import { Expense, Category } from '../models/expenseModel';
import { normalizeCategory } from '../utils/categoryNormalizer';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expenseData: Omit<Expense, '_id' | 'createdAt' | 'updatedAt'> = req.body;

    const normalizedCategory = normalizeCategory(expenseData.categoria as any); // Usamos 'as any' para tratar a entrada inicial como string
    if (!normalizedCategory) {
      return res.status(400).json({ 
        message: 'Categoria inválida.',
        validCategories: Object.values(Category) 
      });
    }
    expenseData.categoria = normalizedCategory;

    const newExpenseId = await expenseService.createExpense(expenseData);
    res.status(201).json({ id: newExpenseId });
  } catch (error) {
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

    // Se a categoria está sendo atualizada, normaliza e valida
    if (expenseData.categoria) {
      const normalizedCategory = normalizeCategory(expenseData.categoria as any);
      if (!normalizedCategory) {
        return res.status(400).json({ 
          message: 'Categoria inválida.',
          validCategories: Object.values(Category)
        });
      }
      expenseData.categoria = normalizedCategory;
    }
    
    await expenseService.updateExpense(req.params.id, expenseData);
    res.status(200).json({ message: 'Despesa atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar despesa' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    res.status(200).json({ message: 'Despesa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar despesa' });
  }
};
