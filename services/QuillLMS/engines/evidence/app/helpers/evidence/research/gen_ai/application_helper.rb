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

        # rubocop:disable Metrics/CyclomaticComplexity
        def llm_example_match_color(llm_example, task_type)
          if task_type == Dataset::CLASSIFICATION
            return LIGHT_GREEN if llm_example.rag_label == llm_example.test_example.rag_label
            return DARK_RED if llm_example.optimal?
            return LIGHT_RED if llm_example.suboptimal?
          elsif task_type == Dataset::GENERATIVE
            return LIGHT_GREEN if llm_example.optimal_or_suboptimal_match?
            return LIGHT_RED if llm_example.optimal?
            return DARK_RED if llm_example.suboptimal?
          end
        end
        # rubocop:enable Metrics/CyclomaticComplexity

        def percent_accuracy(numerator, denominator)
          return 0 if denominator.zero?

          "#{(100.0 * numerator.to_f / denominator.to_f).round}% (#{numerator}/#{denominator})"
        end
      end
    end
  end
end
