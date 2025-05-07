import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import { addExpense } from './utils';
import { categories, subcategories } from '~/faker';

describe('Manage categories page', () => {
  test('there is a link to the manage categories page in the add category modal', async ({ page }) => {
    await page.goto('http://localhost:3030/');

    await page.getByTestId('add-expense').click();

    await page.getByRole('link', { name: 'Gestisci categorie' }).click()

    await expect(page).toHaveURL(/\/categories$/)
  });

  test('there is a link to the manage categories page in the edit category modal', async ({ page }) => {
    await page.goto('http://localhost:3030/');

    await addExpense(page, { name: 'foo', value: 1 })

    await page.getByTestId('edit-expense-btn').click();

    await page.getByTestId('edit-expense-dialog').getByRole('link', { name: 'Gestisci categorie' }).click()

    await expect(page).toHaveURL(/\/categories$/)
  });

  test('all the categories and subcategories are shown', async ({ page }) => {
    await page.goto('http://localhost:3030/categories');

    await Promise.all(categories.map(async category => {
      await expect(page.getByText(category).first()).toBeVisible()
      await Promise.all(subcategories[category].map(subcategory => expect(page.getByText(subcategory).first()).toBeVisible()))
    }))
  });

  test('there is a link to the home page', async ({ page }) => {
    await page.goto('http://localhost:3030/categories');

    await page.getByRole('link', { name: 'home' }).click();

    await expect(page.getByTestId('home-page')).toBeAttached();
  })
})

describe('subcategories', () => {
  test('a subcategory can be deleted', async ({ page }) => {
    await page.goto('http://localhost:3030/categories');

    await expect(page.getByText('xpug')).toBeVisible();
    await page.getByText('xpug').click();
    await page.getByRole('button', { name: 'cancella sottocategoria xpug' }).click();
    await expect(page.getByText('xpug')).not.toBeAttached();
  })

  test('a subcategory can be added', async ({ page }) => {
    await page.goto('http://localhost:3030/categories');

    await page.getByTestId('add-subcategory-btn').first().click();
    await page.getByTestId('add-subcategory-input').first().fill('new subcategory');
    await page.getByTestId('add-subcategory-btn').first().click();
    await expect(page.getByText('new subcategory')).toBeVisible();
  })

  test('a subcategory can be modified', async ({ page }) => {
    await page.goto('http://localhost:3030/categories');

    await page.getByText('xpug').click();
    await page.getByTestId('subcategory-xpug').getByTestId('subcategory-edit-input').fill('xpug2');
    await page.getByTestId('subcategory-xpug').getByRole('button', { name: 'salva sottocategoria xpug' }).click();
    await expect(page.getByText('xpug2')).toBeVisible();
  })
})