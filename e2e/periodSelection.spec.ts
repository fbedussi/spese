import { test, expect } from '@playwright/test';
import { addExpense } from './utils';
import { YyyyMmDd } from '~/types';
import { subWeeks } from 'date-fns';

test('has period selection buttons, 1m is selected by default', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page.getByRole('button', { name: '1s' })).toBeVisible();
  await expect(page.getByRole('button', { name: '1m' })).toBeVisible();
  await expect(page.getByRole('button', { name: '1m' })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('button', { name: '1a' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'da/a' })).toBeVisible();
});

test('has total for period', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page.getByTestId('total-for-period')).toBeVisible();
  await expect(page.getByTestId('total-for-period')).toHaveText('ultimo mese: €0');
});

test('the "add an expense" button opens the add an expense dialog', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await page.getByRole('button', { name: 'da/a' }).click()

  await expect(page.getByTestId('set-dates-form')).toBeVisible();
});

test('changing the period filters the list', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await addExpense(page, 'foo', 1, new YyyyMmDd(new Date()).get())
  await addExpense(page, 'baz', 2, new YyyyMmDd(subWeeks(new Date(), 2)).get())

  await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'foo' })).toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€1' })).toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'baz' })).toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€2' })).toBeVisible();

  await page.getByRole('button', { name: '1s' }).click();

  await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'foo' })).toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€1' })).toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'baz' })).not.toBeVisible();
  await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€2' })).not.toBeVisible();
})