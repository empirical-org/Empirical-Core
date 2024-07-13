# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module ApplicationHelper
        EASTERN_TIME_ZONE = 'Eastern Time (US & Canada)'

        def eastern_date(datetime)
          datetime.in_time_zone(EASTERN_TIME_ZONE).strftime("%m/%d/%y")
        end

        def eastern_datetime(datetime)
          datetime.in_time_zone(EASTERN_TIME_ZONE).strftime("%m/%d/%y, %I:%M %p")
        end
      end
    end
  end
end
