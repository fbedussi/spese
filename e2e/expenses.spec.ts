import { test, expect } from '@playwright/test';
import { addExpense } from './utils';
import { describe } from 'node:test';
import { YyyyMmDd } from '~/types';

describe('add expense', () => {
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
    await addExpense(page, { name: 'foo', value: 1 })
    await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'foo' })).toBeVisible();
    await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€1' })).toBeVisible();
  });

  test('in the add expense form, the subcategory depends on the selected category', async ({ page }) => {
    await page.goto('http://localhost:3030');

    await page.getByTestId('add-expense').click();
    await page.getByTestId('select-category').selectOption('restaurant');
    await page.getByTestId('select-subcategory').selectOption('xpug');
  });

  test('[bug] after an expense is added the add expense form is cleared out', async ({ page }) => {
    await page.goto('http://localhost:3030');
    await addExpense(page, { name: 'foo', value: 1 })

    await page.getByTestId('add-expense').click();

    await expect(page.getByTestId('add-expense-dialog').locator('input[name="date"]')).toHaveValue(new YyyyMmDd(new Date()).get());
    await expect(page.getByTestId('add-expense-dialog').locator('input[name="name"]')).toHaveValue('');
    await expect(page.getByTestId('add-expense-dialog').locator('input[name="value"]')).toHaveValue('');
    await expect(page.getByTestId('add-expense-dialog').locator('input[name="span"]')).toHaveValue('1');
    await expect(page.getByTestId('add-expense-dialog').locator('select[name="category"]')).toHaveValue('other');
    await expect(page.getByTestId('add-expense-dialog').locator('select[name="subcategory"]')).toHaveValue('other');
  });
})

describe('edit an expense', () => {
  test('there is the edit expense button', async ({ page }) => {
    await page.goto('http://localhost:3030/');
    await addExpense(page, { name: 'foo', value: 1 })

    await expect(page.getByRole('button', { name: 'modifica spesa' })).toBeVisible();
  });

  test('the edit expense button opens the edit expense dialog', async ({ page }) => {
    await page.goto('http://localhost:3030/');
    await addExpense(page, { name: 'foo', value: 1 })

    await page.getByRole('button', { name: 'modifica spesa' }).click()

    await expect(page.getByTestId('edit-expense-dialog')).toBeVisible();
  });

  test('in the edit expense form, the subcategory depends on the selected category', async ({ page }) => {
    await page.goto('http://localhost:3030');

    await page.getByTestId('add-expense').click();
    await page.getByTestId('select-category').selectOption('restaurant');
    await page.getByTestId('select-subcategory').selectOption('xpug');
  });

  test('the edit expense form is populated with expense data', async ({ page }) => {
    await page.goto('http://localhost:3030/');
    const category = 'restaurant';
    const subcategory = 'xpug';
    await addExpense(page, { name: 'foo', value: 1, span: 2, category, subcategory })

    await page.getByTestId('edit-expense-btn').click()

    await expect(page.getByTestId('edit-expense-dialog').locator('input[name="date"]')).toHaveValue(new YyyyMmDd(new Date()).get());
    await expect(page.getByTestId('edit-expense-dialog').locator('input[name="name"]')).toHaveValue('foo');
    await expect(page.getByTestId('edit-expense-dialog').locator('input[name="value"]')).toHaveValue('1');
    await expect(page.getByTestId('edit-expense-dialog').locator('input[name="span"]')).toHaveValue('2');
    await expect(page.getByTestId('edit-expense-dialog').locator('select[name="category"]')).toHaveValue(category);
    await expect(page.getByTestId('edit-expense-dialog').locator('select[name="subcategory"]')).toHaveValue(subcategory);
  });
})

describe('delete an expense', () => {
  test('the edit expense form contains a del expense button', async ({ page }) => {
    await page.goto('http://localhost:3030/');
    await addExpense(page, { name: 'foo', value: 1 })

    await page.getByTestId('edit-expense-btn').click()

    await expect(page.getByTestId('del-expense-btn')).toBeVisible();
  });

  test('the del expense button deletes an expense', async ({ page }) => {
    await page.goto('http://localhost:3030/');
    await addExpense(page, { name: 'foo', value: 1 })

    await page.getByTestId('edit-expense-btn').click()

    await page.getByTestId('del-expense-btn').click();

    await expect(page.getByTestId('expense-list').getByRole('cell', { name: 'foo' })).not.toBeAttached();
    await expect(page.getByTestId('expense-list').getByRole('cell', { name: '€1' })).not.toBeAttached();
  });
});