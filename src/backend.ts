import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { subcategories } from './faker';
import { type Expense, YyyyMmDd } from './types';

const USER_ID = 'userId';

export const getUserId = () => {
  return window.localStorage.getItem(USER_ID);
};

const setUserId = (userId: string) => {
  window.localStorage.setItem(USER_ID, userId);
};

export const authenticate = (email: string, password: string) => {
  return loginBe({ email, password }).then((res) => {
    setUserId(res.id);
    return res.id;
  });
};

const firebaseConfig = {
  apiKey: 'AIzaSyB82182C2WGjdfdlLxiVtW-kSE8Axr4_Eo',
  authDomain: 'traccia-spese-466b0.firebaseapp.com',
  projectId: 'traccia-spese-466b0',
  storageBucket: 'traccia-spese-466b0.firebasestorage.app',
  messagingSenderId: '249175169092',
  appId: '1:249175169092:web:e7df0b1f0739d461160411',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const initAuth = setPersistence(auth, browserLocalPersistence).then(
  () => auth,
);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const loginBe = async ({
  email,
  password,
}: { email: string; password: string }): Promise<{
  id: string;
  username: string;
}> => {
  const auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);
  const response = await signInWithEmailAndPassword(auth, email, password);
  return {
    id: response.user.uid,
    username: response.user.providerData[0].uid,
  };
};

export const logoutBe = async () => {
  const auth = getAuth(app);

  signOut(auth).then(() => {
    return true;
  });
};

type ExpenseBE = Omit<Expense, 'date' | 'id'> & {
  date: string;
  userId: string;
};

const fromExpenseBe = (expenseBE: ExpenseBE, id: string): Expense => {
  const expense = {
    ...expenseBE,
    date: new YyyyMmDd(expenseBE.date),
    userId: undefined,
    id,
  };

  return expense;
};

const toExpenseBe = (expense: Omit<Expense, 'id'>): ExpenseBE => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('user is not logged in');
  }

  return {
    userId,
    ...expense,
    date: expense.date.get(),
  };
};

const EXPENSES_COLLECTION_NAME = 'expenses';

export const getExpenses = async (
  sendExpenses: (expenses: Expense[]) => void,
) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('user is not logged in');
  }

  const q = query(
    collection(db, EXPENSES_COLLECTION_NAME),
    where('userId', '==', userId),
  );
  onSnapshot(q, (querySnapshot) => {
    const updatedExpenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      const expenseBE = doc.data() as ExpenseBE;
      updatedExpenses.push(fromExpenseBe(expenseBE, doc.id));
    });
    sendExpenses(updatedExpenses);
  });
};

export const addExpense = async (
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('user is not logged in');
  }

  const timestamp = new Date().getTime();

  const docRef = await addDoc(collection(db, EXPENSES_COLLECTION_NAME), {
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...expense,
    date: expense.date.get(),
  });
  return docRef.id;
};

export const updateExpense = async (expense: Expense) => {
  if (!expense) {
    return;
  }

  const timestamp = new Date().getTime();

  try {
    const docRef = doc(db, EXPENSES_COLLECTION_NAME, expense.id);
    await updateDoc(docRef, {
      ...toExpenseBe(expense),
      updatedAt: timestamp,
    });
  } catch (err) {
    console.error(JSON.stringify(err));
  }
};

export const deleteExpense = (id: string) =>
  deleteDoc(doc(db, EXPENSES_COLLECTION_NAME, id));

const CATEGORIES_COLLECTION_NAME = 'categories';

type CategoriesBE = {
  userId: string;
  categories: string[];
  subcategories: Record<string, string[]>;
};

export const getCategories = async (
  sendCategories: (categories: string[]) => void,
  sendSubcategories: (subCategories: Record<string, string[]>) => void,
) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('user is not logged in');
  }

  const q = query(
    collection(db, CATEGORIES_COLLECTION_NAME),
    where('userId', '==', userId),
  );
  let categories: string[] = [];
  let subcategories: Record<string, string[]> = {};
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const categoriesBE = doc.data() as CategoriesBE;
      categories = categoriesBE.categories;
      subcategories = categoriesBE.subcategories;
    });
    sendCategories(categories);
    sendSubcategories(subcategories);
  });
};

export const updateCategories = async (
  categories: string[],
  subcategories: Record<string, string[]>,
) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('user is not logged in');
  }

  const timestamp = new Date().getTime();

  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION_NAME),
      where('userId', '==', userId),
    );
    const snapshot = await getDocs(q);
    const docRef = snapshot.docs[0]?.ref;
    if (docRef) {
      await updateDoc(docRef, {
        categories,
        subcategories,
        updatedAt: timestamp,
      });
    } else {
      await addDoc(collection(db, CATEGORIES_COLLECTION_NAME), {
        userId,
        categories,
        subcategories,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  } catch (err) {
    console.error(JSON.stringify(err));
  }
};
