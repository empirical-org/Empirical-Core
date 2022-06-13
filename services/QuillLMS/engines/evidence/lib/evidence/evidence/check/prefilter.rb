# frozen_string_literal: true

module Evidence
  class Check::Prefilter < Check::Base

    def run
      prefilter_check = Evidence::PrefilterCheck.new(entry)
      @response = prefilter_check.feedback_object
    end

  end
end
