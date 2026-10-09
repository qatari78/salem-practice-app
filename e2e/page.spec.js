import { test, expect } from '@playwright/test';

test('the counter page has the expected title and visible buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Salem AI practice app');
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.getByRole('button', { name: 'Add one', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeVisible();
});
