import { test, expect } from '@playwright/test';


test('has visible signup button', async ({ page }) => {
  await page.goto('http://localhost:5000');


  await expect(page.locator('footer')).toBeVisible();
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
