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
  CRITICAL = 'critical'
  DEFAULT = 'default'
  LOW = 'low'
end
