import { useSearchParams } from '@solidjs/router';
import { subMonths, subWeeks, subYears } from 'date-fns';
import { createSignal } from 'solid-js';
import * as backend from './backend.ts'
import * as faker from './faker';
import { getTotal } from './helpers';
import { type Expense, type SearchParams, YyyyMmDd } from './types';

export const [data, setData] = createSignal(
    window.location.search.includes('demo') ? faker.fakeExpenses(50) : [],
);

backend.getExpenses(setData)

export const filteredData = () => {
    const [searchParams] = useSearchParams<SearchParams>();

    return data().filter(({ date }) => {
        if (searchParams.period === 'c' && searchParams.from && searchParams.to) {
            return date.gte(searchParams.from) && date.lte(searchParams.to);
        }

        if (searchParams.period && searchParams.period !== 'c') {
            const periodMap = {
                'settimana': new YyyyMmDd(subWeeks(new Date(), 1)),
                'mese': new YyyyMmDd(subMonths(new Date(), 1)),
                'anno': new YyyyMmDd(subYears(new Date(), 1)),
            } as const;
            return date.gte(periodMap[searchParams.period]);
        }

        return true;
    })
};

export const updateExpense = (expenseToUpdate: Expense) => {
    // setData(
    //     data().map((expense) =>
    //         expense.id === expenseToUpdate.id ? expenseToUpdate : expense,
    //     ),
    // );
    backend.updateExpense(expenseToUpdate)
};

export const delExpense = (id: string) => {
    // setData(data().filter((expense) => expense.id !== id));
    backend.deleteExpense(id)
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

    const disabledCategories = searchParams.disabledCategories?.split(',') || []
    
    return getTotal(filteredData().filter(({category}) => !disabledCategories.includes(category)));
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
    // setData(data().concat(newExpense));
    backend.addExpense(newExpense)
};

export const [categories, setCategories] = createSignal(faker.categories);
export const [subCategories, setSubCategories] = createSignal(
    faker.subcategories,
);

export const deleteSubcategory = ({
    category,
    subcategory,
}: { category: string; subcategory: string }) => {
    setSubCategories({
        ...subCategories(),
        [category]: subCategories()[category].filter((sc) => sc !== subcategory),
    });
};

export const editSubcategory = (props: {
    category: string;
    updatedSubcategory: string;
    index: number;
}) => {
    setSubCategories({
        ...subCategories(),
        [props.category]: subCategories()[props.category].map(
            (subcategory, index) =>
                index === props.index ? props.updatedSubcategory : subcategory,
        ),
    });
};

export const addCategory = (newCategory: string) => {
    if (!categories().includes(newCategory)) {
        setCategories(categories().concat(newCategory));

        setSubCategories({
            ...subCategories(),
            [newCategory]: [],
        });
    }
};

export const addSubcategory = (category: string, newSubcategory: string) => {
    if (
        subCategories()[category] &&
        !subCategories()[category].includes(newSubcategory)
    ) {
        setSubCategories({
            ...subCategories(),
            [category]: subCategories()[category].concat(newSubcategory),
        });
    }
};

export const [limits, setLimits] = createSignal({
    car: 1000,
    motorbike: 1500,
    food: 3000,
    restaurant: 500,
} as Record<string, number>);
