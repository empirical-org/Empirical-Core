# frozen_string_literal: true

class LongProcessNotifier < ApplicationService
  attr_reader :error, :threshold, :options

  def initialize(error, threshold, options = {})
    @error = error
    @threshold = threshold
    @options = options
  end

  def run
    start = self.class.current_time
    result = yield
    runtime = self.class.current_time - start

    ErrorNotifier.report(@error, @options.merge({time_to_execute: runtime})) if runtime >= threshold.to_i
    
    result
  end

  # Used to avoid mocking Time.now directly in specs
  def self.current_time
    Time.current
  end
end
