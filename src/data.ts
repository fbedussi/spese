import { createSignal } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Expense, SearchParams, YyyyMmDd } from "./types";
import { subMonths, subWeeks, subYears } from "date-fns";
import * as faker from './faker';

export const [data, setData] = createSignal(faker.fakeExpenses(50))

export const filteredData = () => {
    const [searchParams] = useSearchParams<SearchParams>();

    return data().filter(({ date }) => {
        if (searchParams.period === 'c' && searchParams.from && searchParams.to) {
            return date.gte(searchParams.from) && date.lte(searchParams.to)
        } else if (searchParams.period && searchParams.period !== 'c') {
            const periodMap = {
                '1s': new YyyyMmDd(subWeeks(new Date(), 1)),
                '1m': new YyyyMmDd(subMonths(new Date(), 1)),
                '1a': new YyyyMmDd(subYears(new Date(), 1)),
            } as const
            return date.gte(periodMap[searchParams.period])
        } else {
            return true
        }
    })
}

export const getTotal = () => {
    return filteredData().reduce((tot, expense) => tot + expense.value, 0)
}

export const addExpense = (formData: { [k: string]: FormDataEntryValue }) => {
    if (typeof formData.name !== 'string') {
        throw new Error('bad name')
    }
    if (typeof formData.date !== 'string') {
        throw new Error('bad date')
    }
    if (typeof formData.category !== 'string') {
        throw new Error('bad category')
    }
    if (typeof formData.subcategory !== 'string') {
        throw new Error('bad subcategory')
    }
    if (typeof formData.span !== 'string') {
        throw new Error('bad span')
    }
    if (typeof formData.value !== 'string') {
        throw new Error('bad value')
    }
    const newExpense = {
        name: formData.name,
        date: new YyyyMmDd(formData.date),
        category: formData.category,
        subcategory: formData.subcategory,
        span: Number(formData.span),
        value: Number(formData.value)
    } as Expense
    setData(data().concat(newExpense))
}

const [categories, setCategories] = createSignal(faker.categories)
const [subCategories, setSubCategories] = createSignal(faker.subcategories)