
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { app } from '../config/firebase';
import { Expense as Expense } from '../models/expenseModel';


class ExpenseDatasource {
    private db = getFirestore(app);
    private collection: string = 'expenses';
    private expensesCollection = collection(this.db, this.collection);

    async create(expense: Expense): Promise<string> {
        const docRef = await addDoc(this.expensesCollection, expense);
        return docRef.id;
    }

    async getAll(): Promise<Expense[]> {
        const snapshot = await getDocs(this.expensesCollection);
        return snapshot.docs.map(doc => doc.data() as Expense);
    }

    async getById(id: string): Promise<Expense | null> {
        const docRef = doc(this.db, this.collection, id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return docSnap.data() as Expense;
    }


    async update(id: string, updates: Partial<Expense>): Promise<void> {
        const docRef = doc(this.db, this.collection, id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error('Expense not found');
        }
        await updateDoc(docRef, updates);
    }

    async remove(id: string): Promise<void> {
        const docRef = doc(this.db, this.collection, id);
        await deleteDoc(docRef);
    }

    // const startOfDay = new Date();
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date();
    // endOfDay.setHours(23, 59, 59, 999);
    async getExpensesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]> {
        const q = query(
            this.expensesCollection,
            where('userId', '==', userId),
            where('createdAt', '>=', startDate.toISOString()),
            where('createdAt', '<=', endDate.toISOString())
        );

        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            return [];
        }
        
        return snapshot.docs.map(doc => doc.data() as Expense);
    }
}

export default ExpenseDatasource;