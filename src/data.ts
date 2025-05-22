import { useSearchParams } from '@solidjs/router';
import { subMonths, subWeeks, subYears } from 'date-fns';
import { createSignal } from 'solid-js';
import * as backend from './backend.ts';
import * as faker from './faker';
import { getTotal } from './helpers';
import {
  type Categories,
  type Expense,
  type SearchParams,
  YyyyMmDd,
} from './types';

const demoMode = window.location.search.includes('demo');

export const [data, setData] = createSignal<Expense[]>([]);

if (demoMode) {
  setData(faker.fakeExpenses(50));
} else {
  backend.getExpenses(setData);
}

export const filteredData = () => {
  const [searchParams] = useSearchParams<SearchParams>();

  return data().filter(({ date }) => {
    if (searchParams.period === 'c' && searchParams.from && searchParams.to) {
      return date.gte(searchParams.from) && date.lte(searchParams.to);
    }

    if (searchParams.period && searchParams.period !== 'c') {
      const periodMap = {
        settimana: new YyyyMmDd(subWeeks(new Date(), 1)),
        mese: new YyyyMmDd(subMonths(new Date(), 1)),
        anno: new YyyyMmDd(subYears(new Date(), 1)),
      } as const;
      return date.gte(periodMap[searchParams.period]);
    }

    return true;
  });
};

export const updateExpense = (expenseToUpdate: Expense) => {
  if (demoMode) {
    setData(
      data().map((expense) =>
        expense.id === expenseToUpdate.id ? expenseToUpdate : expense,
      ),
    );
  } else {
    backend.updateExpense(expenseToUpdate);
  }
};

export const delExpense = (id: string) => {
  if (demoMode) {
    setData(data().filter((expense) => expense.id !== id));
  } else {
    backend.deleteExpense(id);
  }
};

export const filteredDataByCategory = () =>
  filteredData()?.reduce(
    (result, item) => {
      result[item.category] = (result[item.category] || []).concat(item);
      return result;
    },
    {} as Record<string, Expense[]>,
  ) || {};

export const getFilteredDataTotal = () => {
  const [searchParams] = useSearchParams<SearchParams>();

  const disabledCategories = searchParams.disabledCategories?.split(',') || [];

  return getTotal(
    filteredData().filter(
      ({ category }) => !disabledCategories.includes(category),
    ),
  );
};

export const addExpense = (formData: { [k: string]: FormDataEntryValue }) => {
  if (typeof formData.name !== 'string') {
    throw new Error('bad name');
  }
  if (typeof formData.date !== 'string') {
    throw new Error('bad date');
  }
  if (typeof formData.category !== 'string') {
    throw new Error('bad category');
  }
  if (typeof formData.subcategory !== 'string') {
    throw new Error('bad subcategory');
  }
  if (typeof formData.span !== 'string') {
    throw new Error('bad span');
  }
  if (typeof formData.value !== 'string') {
    throw new Error('bad value');
  }
  const newExpense = {
    name: formData.name,
    date: new YyyyMmDd(formData.date),
    category: formData.category,
    subcategory: formData.subcategory,
    span: Number(formData.span),
    value: Number(formData.value),
  } as Omit<Expense, 'id'>;
  if (demoMode) {
    setData(
      data().concat({
        ...newExpense,
        id: crypto.randomUUID(),
      }),
    );
  } else {
    backend.addExpense(newExpense);
  }
};

export const [categories, setCategories] = createSignal<Categories>([]);
export const [subCategories, setSubCategories] = createSignal<
  Record<string, string[]>
>({});

if (demoMode) {
  setCategories(faker.categories);
  setSubCategories(faker.subcategories);
} else {
  backend.getCategories(setCategories, setSubCategories);
}

export const deleteSubcategory = ({
  category,
  subcategory,
}: { category: string; subcategory: string }) => {
  const updatedSubcategories = {
    ...subCategories(),
    [category]: subCategories()[category].filter((sc) => sc !== subcategory),
  };
  if (demoMode) {
    setSubCategories(updatedSubcategories);
  } else {
    backend.updateCategories(categories(), updatedSubcategories);
  }
};

export const editSubcategory = (props: {
  category: string;
  updatedSubcategory: string;
  index: number;
}) => {
  const updatedSubcategories = {
    ...subCategories(),
    [props.category]: subCategories()[props.category].map(
      (subcategory, index) =>
        index === props.index ? props.updatedSubcategory : subcategory,
    ),
  };
  if (demoMode) {
    setSubCategories(updatedSubcategories);
  } else {
    backend.updateCategories(categories(), updatedSubcategories);
  }
};

export const addCategory = (newCategory: string) => {
  if (!categories().includes(newCategory)) {
    const updatedCategories = categories().concat(newCategory);
    const updatedSubcategories = {
      ...subCategories(),
      [newCategory]: [],
    };

    if (demoMode) {
      setCategories(updatedCategories);
      setSubCategories(updatedSubcategories);
    } else {
      backend.updateCategories(updatedCategories, updatedSubcategories);
    }
  }
};

export const addSubcategory = (category: string, newSubcategory: string) => {
  if (
    subCategories()[category] &&
    !subCategories()[category].includes(newSubcategory)
  ) {
    const updatedSubcategories = {
      ...subCategories(),
      [category]: subCategories()[category].concat(newSubcategory),
    };
    if (demoMode) {
      setSubCategories(updatedSubcategories);
    } else {
      backend.updateCategories(categories(), updatedSubcategories);
    }
  }
};

const [limits_, setLimits_] = createSignal<Record<string, number>>({});

export const limits = limits_;

if (demoMode) {
  setLimits_({
    car: 1000,
    motorbike: 1500,
    food: 3000,
    restaurant: 500,
  });
} else {
  backend.getLimits(setLimits_);
}

// args can be the updated limits or a function oldLimits => newLimits
export const setLimits: typeof setLimits_ = (args) => {
  if (demoMode) {
    setLimits_(args);
  } else {
    const updatedLimits = typeof args === 'function' ? args(limits_()) : args;
    backend.updateLimits(updatedLimits);
  }
};
