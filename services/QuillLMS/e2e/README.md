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

## Known issues / gotchas

If you use a node version older than 18.x, running Playwright tests will yield this confusing error:
`TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/pk/local/repos/Empirical-Core/services/QuillLMS/playwright.config.ts`
To address, simply run `nvm use` in the project root
