# e2e testing (Playwright)

## Installation / setup

None (same bundle and npm commands as the main app)

## To run tests locally

0. Load the e2e-relevant seed data: `bundle exec rake local_data:e2e_seed
1. Start the QuillLMS server
2. `npx playwright test`
3. For headed tests, optionally pass the `--headed` flag

## To learn Playwright API and assertions

https://playwright.dev/docs/intro
