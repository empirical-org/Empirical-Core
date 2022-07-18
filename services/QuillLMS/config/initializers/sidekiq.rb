# frozen_string_literal: true

module SidekiqQueue
  # QUEUE DEFINITIONS

  # CRITICAL: Jobs that impact the user experience,
  # e.g. that the user may be waiting on, like student imports
  CRITICAL = 'critical'
  # DEFAULT: Jobs should run soon, but won't have an effect on the user experience
  # if they are delayed. These should not be long-running jobs, put those in LOW.
  DEFAULT = 'default'
  # LOW: Jobs that might be long-running that we don't want to clog up the main workers
  # and that can be delayed.
  LOW = 'low'
  # Critical Jobs that rely on outside APIs, e.g. Google Classroom APIs
  # Giving them their own queue in case we need to isolate them during an API provider issue
  CRITICAL_EXTERNAL = 'critical_external'
  # Migration jobs are intended to backfill large, complicated model changes
  # Giving them their own queue lets us turn migrations entirely off rather
  # than risking normal workers getting tied up on complex migration work
  MIGRATION = 'migration'
end
