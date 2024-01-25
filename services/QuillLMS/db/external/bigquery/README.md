# Instructions for managing BigQuery schema changes

See [docs](https://cloud.google.com/bigquery/docs/materialized-views-create#non-incremental) for more information about BigQuery standard and non-incremental materialized views.

## Initial setup

1. [Install and authenticate the Gcloud CLI.](https://cloud.google.com/sdk/docs/install) The "Google Cloud CLI" is a tool suite that includes both `gcloud` and `bq.`

## Conventions

- All production non-table assets (currently, this means mat views) should be versioned within this directory. All of these commands may be called within the BigQuery Studio "web UI" if necessary.
- SQL files should NOT contain `IF EXISTS` clauses.
- To minimize devops work, assets should be configured to self-refresh whenever possible.

## Core CLI operations

### List existing assets

pattern: `bq ls --format=pretty [project:]mydataset`<br />

example: `bq ls --format=pretty lms | grep MATERIALIZED VIEW`

### Drop existing mat view

pattern: `bq rm dataset.asset`<br />

example: `bq rm playground.testview`

### Create a mat view

pattern: `bq query --use_legacy_sql=false <string or path to file>`<br />

example: `bq query --use_legacy_sql=false "$(cat db/external/bigquery/mat_views/testview.sql)"`
