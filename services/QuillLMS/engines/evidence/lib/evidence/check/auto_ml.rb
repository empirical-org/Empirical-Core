# frozen_string_literal: true

module Evidence
  class Check::AutoML < Check::Base

    def run
      automl_check = Evidence::AutomlCheck.new(entry, prompt, previous_feedback)
      @response = automl_check.feedback_object
    end

    def use_for_optimal_feedback? = true

  end
end
