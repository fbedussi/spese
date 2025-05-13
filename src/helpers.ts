import { addMonths } from 'date-fns';
import { YyyyMmDd } from './types.ts';
import type { Expense } from './types.ts';

export function getFormData<T extends { [k: string]: FormDataEntryValue }>(form: HTMLFormElement) {
  const formData = new FormData(form);
  return Object.fromEntries(formData) as T;
}

const eurFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function formatMoney(value: number) {
  return eurFormatter.format(value);
}

export function filterExpenses(
  expenses: Expense[],
  from: YyyyMmDd,
  to?: YyyyMmDd,
) {
  return expenses.filter((expense) => {
    const startsAfterFrom = expense.date.gte(from);
    const spansAfterFrom = new YyyyMmDd(
      addMonths(expense.date.getDate(), expense.span),
    ).gte(from);
    return (
      (startsAfterFrom || spansAfterFrom) && (to ? expense.date.lte(to) : true)
    );
  });
}

export function getTotal(expenses: Expense[]) {
  return expenses.reduce(
    (tot, expense) => tot + expense.value / expense.span,
    0,
  );
}
