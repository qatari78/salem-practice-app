import { test, expect } from '@playwright/test';

test('total taps counts every add and survives reset', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('total')).toHaveText('Total taps: 0');
  await page.getByTestId('add').click();
  await page.getByTestId('add').click();
  await page.getByTestId('reset').click();
  await page.getByTestId('add').click();
  await expect(page.getByTestId('count')).toHaveText('1');
  await expect(page.getByTestId('total')).toHaveText('Total taps: 3');
});
