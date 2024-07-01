As of June 2024, we plan to migrate the rematch service from AWS Lambda to Cloudflare Worker.
During this time, we need to maintain two build and deploy pipelines in parallel.

Staging & production traffic may be diverted to either platform, without a deployment, by updating
the `REMATCH_LAMBDA_URL` env var in the CMS app.

# initial one-time set up

- `rematching$ nvm use && npm install`
- [Install wrangler locally](https://www.npmjs.com/package/wrangler)

# AWS Lambda - build & deploy

`rematching$ ./deploy.sh <staging|prod>`

# Cloudflare Worker - build & deploy

1. `cd cloudflare_rematch && nvm use` ensure you are using Node 20
2. `export PATH=./node_modules/.bin:$PATH` may be necessary to access the wrangler executable
3. [Optional] Open the [Cloudflare worker UI](https://dash.cloudflare.com/e8be3394a446f6e1bfb5b7c6f726fd09/workers-and-pages) in a browser, for monitoring.
4. `cloudflare_rematch$ ./deploy.sh <staging|prod>`
5. [Optional] Browse the `lambdas/` directory in Postman, which contains idempotent POST requests with known-working paylods for smoketesting in any environment.
