module AsyncHelper
EXCEPTIONS = [RSpec::Expectations::ExpectationNotMetError, StandardError]

def eventually(options = {})
  timeout = options[:timeout] || 2
  interval = options[:interval] || 0.1
  time_limit = Time.now + timeout
  loop do
    begin
      yield
    rescue *EXCEPTIONS => e
      nil
    end
    return if e.nil?
    raise e if Time.now >= time_limit
    sleep interval
  end
end
end
