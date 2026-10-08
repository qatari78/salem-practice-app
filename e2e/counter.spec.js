import { test, expect } from '@playwright/test';

test('the counter starts at 0 and adds one per tap', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('count')).toHaveText('0');
  await page.getByTestId('add').click();
  await page.getByTestId('add').click();
  await expect(page.getByTestId('count')).toHaveText('2');
});
