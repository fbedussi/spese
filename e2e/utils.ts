import { Page } from "@playwright/test";

export async function addExpense(page: Page, name: string, value: number, date?: string) {
    await page.getByTestId('add-expense').click();
    await page.getByRole('textbox', { name: 'Nome' }).fill(name);
    await page.getByRole('spinbutton', { name: '€' }).fill(value.toString());
    if (date) {
        await page.getByRole('textbox', { name: 'Data' }).fill(date);
    }
    await page.getByTestId('save').click();
}