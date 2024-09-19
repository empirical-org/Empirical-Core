# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module ApplicationHelper
        EASTERN_TIME_ZONE = 'Eastern Time (US & Canada)'
        DARK_RED = 'dark-red'
        LIGHT_GREEN = 'light-green'
        LIGHT_RED = 'light-red'

        def date_helper(datetime, time_zone = EASTERN_TIME_ZONE)
          datetime.in_time_zone(time_zone).strftime('%m/%d/%y')
        end

        def datetime_helper(datetime, time_zone = EASTERN_TIME_ZONE)
          datetime.in_time_zone(time_zone).strftime('%m/%d/%y, %I:%M %p')
        end

        def llm_example_match_color(llm_example)
          return LIGHT_GREEN if llm_example.llm_feedback == llm_example.test_example.curriculum_proposed_feedback
          return DARK_RED if llm_example.optimal?
          return LIGHT_RED if llm_example.suboptimal?
        end

        def percent_accuracy(numerator, denominator)
          return 0 if denominator.zero?

          "#{(100.0 * numerator.to_f / denominator.to_f).round}% (#{numerator}/#{denominator})"
        end
      end
    end
  end
end
