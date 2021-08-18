class RefreshResponsesViewWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  REFRESH_TIMEOUT = ENV.fetch("VIEW_STATEMENT_TIMEOUT", '10min')
  VIEWS = %w(GradedResponse MultipleChoiceResponse)

  class InvalidView < StandardError; end

  # Make the DB statement timeout longer while refreshing the materialized view
  def perform(view)
    original_timeout = db_timeout

    raise InvalidView unless view.in?(VIEWS)

    db_set_timeout(REFRESH_TIMEOUT)

    view.constantize.refresh
  ensure
    db_set_timeout(original_timeout)
  end

  private def db_set_timeout(time_string)
    escaped_time_string = ActiveRecord::Base.connection.quote(time_string)

    ActiveRecord::Base.connection.execute("SET statement_timeout = #{escaped_time_string}")
  end

  private def db_timeout
    ActiveRecord::Base.connection.execute('SHOW statement_timeout').first['statement_timeout']
  end
end
