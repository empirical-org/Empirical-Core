# frozen_string_literal: true

module ErrorNotifier
  # pass an exception
  def self.report(error, options = {})
    Sentry.capture_exception(error, extra: options)
    NewRelic::Agent.notice_error(error, options)
  end

  def self.report_long_running(error, threshold, options = {})
    start = current_time
    result = yield
    runtime = current_time - start
    return result if runtime < threshold.to_i

    report(error, options.merge({time_to_execute: runtime}))
    result
  end

  # Used to avoid mocking Time.now directly in specs
  def self.current_time
    Time.now
  end
end
