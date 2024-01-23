
CREATE MATERIALIZED VIEW analytics-data-stores.playground.testview
OPTIONS (
  enable_refresh = true, refresh_interval_minutes = 1440,
  max_staleness = INTERVAL "24" HOUR,
    allow_non_incremental_definition = true
)
AS ( SELECT * from users LIMIT 5)

