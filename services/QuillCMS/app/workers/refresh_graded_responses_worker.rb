class RefreshGradedResponsesWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  REFRESH_TIMEOUT = ENV["VIEW_STATEMENT_TIMEOUT"] || '10min'

  # Make the DB statement timeout longer while refreshing the materialized view
  def perform
    original_timeout = db_timeout
    set_db_timeout(REFRESH_TIMEOUT)

    GradedResponse.refresh
  ensure
    set_db_timeout(original_timeout)
  end

  private def set_db_timeout(time_string)
    escaped_time_string = ActiveRecord::Base.connection.quote(time_string)

    ActiveRecord::Base.connection.execute("SET statement_timeout = #{escaped_time_string}")
  end

  private def db_timeout
    ActiveRecord::Base.connection.execute('SHOW statement_timeout').first['statement_timeout']
  end
end
