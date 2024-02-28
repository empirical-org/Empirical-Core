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
- BigQuery automatically updates materialized views as new data comes in from the underlying tables
- There are some [restrictions](https://cloud.google.com/bigquery/docs/materialized-views-create#query_limitations) on what the materialized view can contain, e.g. you can't use `OUTER JOINS`.
- There are [tips](https://cloud.google.com/bigquery/docs/materialized-views-create#which_materialized_views_to_create) on creating efficient materialized views, e.g. put the largest, most frequently changing table first in the query,

### How to Create a Materialized View
```SQL
CREATE MATERIALIZED VIEW DATASET.MATERIALIZED_VIEW_NAME AS (
  # QUERY_EXPRESSION
);
```
