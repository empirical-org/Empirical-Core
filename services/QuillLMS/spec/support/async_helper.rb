# frozen_string_literal: true

module AsyncHelper
  EXCEPTIONS = [RSpec::Expectations::ExpectationNotMetError, StandardError]

  def eventually(options = {})
    timeout = options[:timeout] || 2
    interval = options[:interval] || 0.1
    time_limit = Time.current + timeout
    loop do
      begin
        yield
      rescue *EXCEPTIONS => e
        nil
      end
      return if e.nil?
      raise e if Time.current >= time_limit

      sleep interval
    end
  end
end
