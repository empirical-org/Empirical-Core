# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module ApplicationHelper
        EASTERN_TIME_ZONE = 'Eastern Time (US & Canada)'

        def date_helper(datetime, time_zone = EASTERN_TIME_ZONE)
          datetime.in_time_zone(time_zone).strftime("%m/%d/%y")
        end

        def datetime_helper(datetime, time_zone = EASTERN_TIME_ZONE)
          datetime.in_time_zone(time_zone).strftime("%m/%d/%y, %I:%M %p")
        end

        def percent_accuracy(numerator, denominator)
          return 0 if denominator.zero?

          "#{(100.0 * numerator.to_f / denominator.to_f).round}% (#{numerator}/#{denominator})"
        end
      end
    end
  end
end
