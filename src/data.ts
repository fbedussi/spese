import { createSignal } from "solid-js";
import { fakeExpenses } from "./faker";
import { useSearchParams } from "@solidjs/router";
import { Expense, YyyyMmDd } from "./types";
import { subMonths, subWeeks, subYears } from "date-fns";

export const [data, setData] = createSignal(fakeExpenses(50))

export const filteredData = () => {
    const [searchParams] = useSearchParams<{ period: '1s' | '1m' | '1a' }>();
    return data().filter(({ date }) => {
        const periodMap = {
            '1s': new YyyyMmDd(subWeeks(new Date(), 1)),
            '1m': new YyyyMmDd(subMonths(new Date(), 1)),
            '1a': new YyyyMmDd(subYears(new Date(), 1)),
        } as const
        return searchParams.period ? date.gte(periodMap[searchParams.period]) : true
    })
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