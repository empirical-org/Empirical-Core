# frozen_string_literal: true

module Evidence
  class Check::Base

    attr_reader :entry, :prompt, :previous_feedback, :error, :response

    def initialize(entry, prompt, previous_feedback)
      @entry = entry
      @prompt = prompt
      @previous_feedback = previous_feedback
    end

    # run method of subclass should populate @response with the API response
    # it can optionally populate @error
    def run
      raise NotImplementedError
    end

    def self.run(entry, prompt, previous_feedback)
      new(entry, prompt, previous_feedback).tap do |check|
        begin
          check.run
        rescue => e
          Evidence.error_notifier.report(e)

          @error = e
        end
      end
    end

    def optimal?
      return true unless response

      response.stringify_keys['optimal']
    end

    def auto_ml?
      false
    end

    def success?
      error.nil?
    end
  end
end
