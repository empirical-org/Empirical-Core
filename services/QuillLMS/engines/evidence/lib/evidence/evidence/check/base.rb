# frozen_string_literal: true

module Evidence
  class Check::Base

    attr_reader :entry, :prompt, :previous_feedback, :session_uid, :error, :response

    def initialize(entry, prompt, previous_feedback, session_uid)
      @entry = entry
      @prompt = prompt
      @previous_feedback = previous_feedback
      @session_uid = session_uid
    end

    # run method of subclass should populate @response with the API response
    # it can optionally populate @error
    def run
      raise NotImplementedError
    end

    def self.run(entry, prompt, previous_feedback, session_uid)
      new(entry, prompt, previous_feedback, session_uid).tap do |check|
        begin
          check.run
        rescue => e
          context = {entry: entry, prompt_id: prompt&.id, prompt_text: prompt&.text}
          Evidence.error_notifier.report(e, context)

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
