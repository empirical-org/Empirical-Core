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
  //await page.getByLabel('Email or username').press('Tab');
  await page.getByLabel('Password', { exact: true }).fill('password');
  // Other clickable items on this page include the text 'Log in', so we need a more
  // sensitive element selector
  await expect(page.locator('#log-in')).toBeVisible()
  await page.locator('#log-in').click();
  console.log("page url", page.url());
  await page.waitForURL('http://localhost:5000/teachers/classrooms/dashboard');
});
