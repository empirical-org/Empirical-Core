
CREATE MATERIALIZED VIEW analytics-data-stores.lms.testview
OPTIONS (
  enable_refresh = true, refresh_interval_minutes = 1440,
  max_staleness = INTERVAL "24" HOUR,
    allow_non_incremental_definition = true
)
AS ( SELECT * from lms.users LIMIT 5)

