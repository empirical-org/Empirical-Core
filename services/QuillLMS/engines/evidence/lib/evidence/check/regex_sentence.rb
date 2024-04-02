# frozen_string_literal: true

module Evidence
  class Check::RegexSentence < Check::Base

    def run
      regex_check = Evidence::RegexCheck.new(entry, prompt, Evidence::Rule::TYPE_REGEX_ONE)
      @response = regex_check.feedback_object
    end

  end
end
