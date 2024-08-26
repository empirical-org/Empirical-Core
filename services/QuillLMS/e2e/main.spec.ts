import { test, expect } from '@playwright/test';

test.skip('has visible footer', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('footer')).toBeVisible();
});

function filterAndLogRequest(request, simpleMatcher) {
  if (request.url().includes(simpleMatcher)) {
    console.log('>>', request.method(), request.url())
  }
}

function filterAndLogResponse(response, simpleMatcher) {
  if (response.url().includes(simpleMatcher)) {
    console.log('>>', response.status(), response.url())
  }
}

test('@login form submission with valid credentials', async ({ page }) => {
  page.on('request', request => filterAndLogRequest(request, 'quill'));
  page.on('response', response => filterAndLogResponse(response, 'quill'));

  await page.goto('/session/new');

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
  await page.waitForTimeout(1000);
  // await page.mouse.wheel(0,200)

  await page.screenshot({ path: 'test-results/playwright_login.png', fullPage: true });

  await page.waitForURL('/teachers/classrooms/dashboard');
});
