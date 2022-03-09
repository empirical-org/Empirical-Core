module Evidence
  class Check::Spelling < Check::Base

    def run
      spelling_check = Evidence::SpellingCheck.new(entry)
      @error = spelling_check.error
      @response = spelling_check.feedback_object
    end

  end
end
