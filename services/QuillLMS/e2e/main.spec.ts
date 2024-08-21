import { test, expect } from '@playwright/test';

test('has visible footer', async ({ page }) => {
  await page.goto('http://localhost:5000');

  await expect(page.locator('footer')).toBeVisible();
});


test('@login form submission with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:5000/session/new');

  await page.getByLabel('Email or username').click();
  await expect(page.getByLabel('Email or username')).toBeVisible();
  await page.getByLabel('Email or username').fill('johnnyci@gmail.com');

  await expect(page.locator('.password-wrapper #password')).toBeVisible();
  await page.locator('.password-wrapper #password').fill('password');
  // Other clickable items on this page include the text 'Log in', so we need a more
  // sensitive element selector
  await page.waitForSelector('#log-in');
  await expect(page.locator('#log-in')).toBeVisible()
  await page.locator('#log-in').click();

  await page.screenshot({ path: 'test-results/playwright_screenshot.png' });

  await page.waitForURL('http://localhost:5000/teachers/classrooms/dashboard');
});
