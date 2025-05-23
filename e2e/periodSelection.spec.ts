import { expect, test } from '@playwright/test';
import { subWeeks } from 'date-fns';
import { YyyyMmDd } from '~/types';
import { addExpense } from './utils';

test('has period selection buttons, 1m is selected by default', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page.getByRole('button', { name: 'settimana' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'mese' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'mese' })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('button', { name: 'anno' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'da/a' })).toBeVisible();
});

test('has total for period', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page.getByTestId('total-for-period')).toBeVisible();
  await expect(page.getByTestId('total-for-period')).toHaveText('€0ultimo mese');
});

test('the "add an expense" button opens the add an expense dialog', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await page.getByRole('button', { name: 'da/a' }).click()

  await expect(page.getByTestId('set-dates-form')).toBeVisible();
});

test('changing the period filters the list', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await addExpense(page, { name: 'foo', value: 1, date: new YyyyMmDd(new Date()) });
  await addExpense(page, { name: 'baz', value: 2, date: new YyyyMmDd(subWeeks(new Date(), 2)) });

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