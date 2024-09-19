import { test, expect } from '@playwright/test';

test.skip('has visible footer', async ({ page }) => {
  await page.goto('/session/new');

  await expect(page.locator('p.sign-up-link')).toBeVisible();
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
  page.on('request', request => filterAndLogRequest(request, 'login_through_ajax'));
  page.on('console', msg => console.log(msg.text()));
  //page.on('response', response => filterAndLogResponse(response, 'localhost|quill'));

  await page.goto('/session/new');
  await page.waitForLoadState('networkidle');

  await page.getByLabel('Email or username').click();
  await expect(page.getByLabel('Email or username')).toBeVisible();
  await page.getByLabel('Email or username').fill('johnnyci@gmail.com');

  await expect(page.locator('.password-wrapper #password')).toBeVisible();
  await page.locator('.password-wrapper #password').fill('password');
  // Other clickable items on this page include the text 'Log in', so we need a more
  // sensitive element selector

  // await page.waitForSelector('#log-in');
  // await expect(page.locator('#log-in')).toBeVisible()

  await page.screenshot({ path: 'test-results/login-pre-click.png', fullPage: true });

  //await page.locator('div.account-container div.login-form').click()
  await page.locator('div.account-container.text-center div.login-form input#log-in').click();
  // await page.locator('#log-in').dispatchEvent('click');


  await page.screenshot({ path: 'test-results/login-post-click.png', fullPage: true });

  await page.waitForURL('/teachers/classrooms/dashboard')



});
