import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page).toHaveTitle(/Traccia spese/i);
  await expect(page.getByRole('heading', { name: /Traccia spese/i })).toBeVisible();
});
