import { test, expect } from '@playwright/test';

test('reset returns the counter to 0 and counting resumes at 1', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('add').click();
  await page.getByTestId('add').click();
  await expect(page.getByTestId('count')).toHaveText('2');
  await page.getByTestId('reset').click();
  await expect(page.getByTestId('count')).toHaveText('0');
  await page.getByTestId('add').click();
  await expect(page.getByTestId('count')).toHaveText('1');
});
