### BigQuery Migrations

This folder contains BigQuery-specific configurations that we've run on production, e.g. data transformations, materialized views, etc., for documentation purposes. Since these are not run on our Postgres DB (and are not run at all in `development` and `test` environments), we're putting them in folder separate from `migrations`. You should never have to run these queries, but in case you need to debug the reporting queries, this will give you their structure.

The `views` folder contains SQL commands for creating ["Materialized Views"](https://cloud.google.com/bigquery/docs/materialized-views-intro). We are using materialized views to create tables in BigQuery that make common reporting queries more efficient by one or more methods. From BigQuery's docs:
```
The following use cases highlight the value of materialized views. Materialized views can improve query performance if you frequently require the following:

- Pre-aggregate data. Aggregation of streaming data.
- Pre-filter data. Run queries that only read a particular subset of the table.
- Pre-join data. Query joins, especially between large and small tables.
- Recluster data. Run queries that would benefit from a clustering scheme that differs from the base tables.
```

Important to know:
- BigQuery, by default, automatically updates "incremental" materialized views as new data comes in from the underlying tables. You can turn this updating off/adjust it using `OPTIONS` in the create statement.
- There are some [restrictions](https://cloud.google.com/bigquery/docs/materialized-views-create#query_limitations) on what the incremental materialized view can contain, e.g. you can't use `OUTER JOINS`. Non-incremental Mat Views (ones that aren't updated automatically) do not have these restrictions.
- There are [tips](https://cloud.google.com/bigquery/docs/materialized-views-create#which_materialized_views_to_create) on creating efficient materialized views, e.g. put the largest, most frequently changing table first in the query
- To minimize devops work, views should be configured to self-refresh (incremental mat views) whenever possible.

### How to Create a Materialized View In SQL
```SQL
CREATE MATERIALIZED VIEW DATASET.MATERIALIZED_VIEW_NAME AS (
  # QUERY_EXPRESSION
);
```
### How to create a new Materialized View in the LMS
1. Add a new entry to `config/big_query_views.yml` following pattern of other entries
2. Add .sql file referenced in config to `db/big_query/views/`. Note, this should note include the "CREATE" command, just the inner SQL.
2. Run a command to `create/drop/refresh` the view (you need the write permission credentials to do this locally, else do this on staging or production)
#### Available Commands
```
thor quill_big_query:materialized_views:create view_key   # Creates a specified Materialized View
thor quill_big_query:materialized_views:drop view_key     # Drops a specified Materialized View
thor quill_big_query:materialized_views:refresh view_key  # Refreshes (drops and creates) a specified Materialized View
```
### Migrating to new View Version
We haven't done this yet, so this should be a discussion when it comes up, but there are two ways to do this:
1. Deploy a new view: Deploy the new view config, and put the mat view in place. Then deploy code that points to the new view. Requires 2 deploys, but no query downtime.
2. Edit an existing view: Deploy code with an updated config at once. Once deploy finishes, refresh materialized view with new sql. Requires 1 deploy, with a small query downtime (between deploy finish and mat view refresh).



### CLI
Google has a CLI to run BQ commands. Here are some example uses
#### Initial setup

1. [Install and authenticate the Gcloud CLI.](https://cloud.google.com/sdk/docs/install) The "Google Cloud CLI" is a tool suite that includes both `gcloud` and `bq.`

#### Core CLI operations

#### List existing assets

pattern: `bq ls --format=pretty [project:]mydataset`<br />

example: `bq ls --format=pretty lms | grep MATERIALIZED VIEW`

#### Drop existing mat view

pattern: `bq rm dataset.asset`<br />

example: `bq rm playground.testview`

#### Create a mat view

pattern: `bq query --use_legacy_sql=false <string or path to file>`<br />

example: `bq query --use_legacy_sql=false "$(cat db/external/bigquery/mat_views/testview.sql)"`




