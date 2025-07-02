
import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';
import { helloWord } from '../controllers/helloController';

const router = Router();

router.get('/hello-word', helloWord);
router.post('/gastos', createExpense);
router.get('/gastos', getExpenses);
router.get('/gastos/:id', getExpenseById);
router.put('/gastos/:id', updateExpense);
router.delete('/gastos/:id', deleteExpense);

export default router;
