# frozen_string_literal: true

module Evidence
  class Check::Spelling < Check::Base

    class BingException < StandardError; end

    def run
      spelling_check = Evidence::SpellingCheck.new(entry, previous_feedback)

      if spelling_check.error
        raise BingException, spelling_check.error
      end

      @response = spelling_check.feedback_object
    end

  end
end
