
import { Router } from 'express';
import { createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
 } from '../controllers/expenseController';

const router = Router();

router.post('/gastos', createExpense);
router.get('/gastos', getExpenses);
router.get('/gastos/:id', getExpenseById);
router.put('/gastos/:id', updateExpense);
router.delete('/gastos/:id', deleteExpense);

export default router;
