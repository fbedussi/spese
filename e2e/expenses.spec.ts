import { test, expect } from '@playwright/test';
import { addExpense } from './utils';

test('there is the add expense button', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page.getByRole('button', { name: 'aggiungi spesa' })).toBeVisible();
});

test('the "add an expense" button opens the add an expense dialog', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await page.getByTestId('add-expense').click()

  await expect(page.getByTestId('add-expense-dialog')).toBeVisible();
});

test('some fields are mandatory', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await page.getByTestId('add-expense').click();
  await expect(page.locator('input[name="name"][required]')).toBeVisible()
  await expect(page.locator('input[name="value"][required]')).toBeVisible()
});

test('an expense is added', async ({ page }) => {
  await page.goto('http://localhost:3030');
  await addExpense(page, 'foo', 1)
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'foo' })).toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€1' })).toBeVisible();
});
