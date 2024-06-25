As of June 2024, we plan to migrate the rematch service from AWS Lambda to Cloudflare Worker.
During this time, we need to maintain two build and deploy pipelines in parallel.

Staging & production traffic may be diverted to either platform, without a deployment, by updating
the `REMATCH_LAMBDA_URL` env var in the CMS app.

# AWS Lambda - build & deploy

`rematching$ ./deploy.sh`

# Cloudflare Worker

0. [Install wrangler locally](https://www.npmjs.com/package/wrangler)
1. export PATH=./node_modules/.bin:$PATH may be necessary to access the wrangler executable
2. Open the [Cloudflare worker UI](https://dash.cloudflare.com/e8be3394a446f6e1bfb5b7c6f726fd09/workers-and-pages) in a browser.
3. `cloudflare_rematching$ ENTRY_POINT=index-cloudflare.js ../rematching/build_cloudflare.sh`
4. `wrangler deploy ../rematching/dist/index.js`
