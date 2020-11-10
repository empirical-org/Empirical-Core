class StickToLeaderDbSidekiqMiddleware
  def call(worker, msg, queue)
    ActiveRecord::Base.connection.stick_to_master!
    yield
  end
end

#Sidekiq.configure_server do |config|
#  config.server_middleware do |chain|
#    chain.add(StickToLeaderDbSidekiqMiddleware)
#  end
#end

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
end
