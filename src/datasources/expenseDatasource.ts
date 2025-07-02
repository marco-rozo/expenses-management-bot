
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { app } from '../config/firebase';
import { Expense } from '../models/expenseModel';

const db = getFirestore(app);
const expensesCollection = collection(db, 'expenses');

export const create = async (expense: Expense): Promise<string> => {
    const docRef = await addDoc(expensesCollection, expense);
    // We need to find the document we just added to get the _id
    const q = query(expensesCollection, where('_id', '==', expense._id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
    }
    return docRef.id;
};


export const getAll = async (): Promise<Expense[]> => {
    const snapshot = await getDocs(expensesCollection);
    return snapshot.docs.map(doc => doc.data() as Expense);
};

export const getById = async (id: string): Promise<Expense | null> => {
    const q = query(expensesCollection, where('_id', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    return querySnapshot.docs[0].data() as Expense;
};

export const update = async (id: string, updates: Partial<Expense>): Promise<void> => {
    const q = query(expensesCollection, where('_id', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error('Expense not found');
    }
    const docRef = doc(db, 'expenses', querySnapshot.docs[0].id);
    await updateDoc(docRef, updates);
};

export const remove = async (id: string): Promise<void> => {
    const q = query(expensesCollection, where('_id', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error('Expense not found');
    }
    const docRef = doc(db, 'expenses', querySnapshot.docs[0].id);
    await deleteDoc(docRef);
};
