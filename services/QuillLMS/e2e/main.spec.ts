import { test, expect } from '@playwright/test';

test.skip('has visible footer', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('footer')).toBeVisible();
});

function filterAndLogRequest(request, regex) {
  const re = new RegExp(regex);
  if (request.url().match(re)) {
    console.log('>>', request.method(), request.url())
  }
}

function filterAndLogResponse(response, regex) {
  const re = new RegExp(regex);
  if (response.url().match(re)) {
    console.log('<<', response.status(), response.url())
  }
}

test('@login form submission with valid credentials', async ({ page }) => {
  page.on('request', request => filterAndLogRequest(request, 'localhost|quill'));
  page.on('response', response => filterAndLogResponse(response, 'localhost|quill'));

  await page.goto('/session/new');
  await page.waitForLoadState('networkidle');

  await page.getByLabel('Email or username').click();
  await expect(page.getByLabel('Email or username')).toBeVisible();
  await page.getByLabel('Email or username').fill('johnnyci@gmail.com');

  await expect(page.locator('.password-wrapper #password')).toBeVisible();
  await page.locator('.password-wrapper #password').fill('password');
  // Other clickable items on this page include the text 'Log in', so we need a more
  // sensitive element selector
  await page.waitForSelector('#log-in');
  await expect(page.locator('#log-in')).toBeVisible()



  // await page.mouse.wheel(0,200)

  await page.screenshot({ path: 'test-results/playwright_login.png', fullPage: true });

  await expect( async () => {
    await page.locator('#log-in').click();
    await page.waitForURL('/teachers/classrooms/dashboard')
  }).toPass()

});
