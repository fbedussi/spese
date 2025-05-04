import { Page } from "@playwright/test";
import { Expense } from "~/types";

export async function addExpense(page: Page, expense: Partial<Expense>) {
    await page.getByTestId('add-expense').click();
    await page.getByRole('textbox', { name: 'Nome' }).fill(expense.name || 'default name');
    await page.getByRole('spinbutton', { name: '€' }).fill(expense.value?.toString() || '0');
    if (expense.date) {
        await page.getByTestId('date-input').fill(expense.date.get());
    }
    if (expense.span) {
        await page.getByRole('spinbutton', { name: 'Periodo (in mesi)' }).fill(expense.span.toString());
    }
    await page.getByTestId('select-category').selectOption(expense.category || 'other');
    if (expense.subcategory) {
        await page.getByTestId('select-subcategory').selectOption(expense.subcategory);
    }
    await page.getByTestId('save').click();
}