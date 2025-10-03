
import { db } from '../config/firebase';
import { Expense as Expense } from '../models/expenseModel';


class ExpenseDatasource {
    private collection = "expenses";
    private expensesCollection = db.collection(this.collection);

    async create(expense: Expense): Promise<string> {
        const docRef = await this.expensesCollection.add(expense);
        return docRef.id;
    }

    async getAll(): Promise<Expense[]> {
        const snapshot = await this.expensesCollection.get();
        return snapshot.docs.map((doc) => doc.data() as Expense);
    }

    async getById(id: string): Promise<Expense | null> {
        const docRef = this.expensesCollection.doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) return null;
        return docSnap.data() as Expense;
    }


    async update(id: string, updates: Partial<Expense>): Promise<void> {
        const docRef = this.expensesCollection.doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
        throw new Error("Expense not found");
        }
        await docRef.update(updates);
    }

    async remove(id: string): Promise<void> {
        const docRef = this.expensesCollection.doc(id);
        await docRef.delete();
    }

    async getExpensesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]> {
        const snapshot = await this.expensesCollection
            .where("userId", "==", userId)
            .where("createdAt", ">=", startDate.toISOString())
            .where("createdAt", "<=", endDate.toISOString())
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map((doc) => doc.data() as Expense);
    }
}

export default ExpenseDatasource;