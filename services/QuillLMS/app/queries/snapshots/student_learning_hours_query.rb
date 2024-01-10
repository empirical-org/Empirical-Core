# frozen_string_literal: true

module Snapshots
  class StudentLearningHoursQuery < ReportingSessionCountQuery

    # BI Engine seems to have an issue using RAM for SUM()
    # Adding * 1 causes BI Engine to use RAM for some reason
    def select_clause
      "SELECT IFNULL(SUM(time_spent * 1), 0) / 3600.0 AS count"
    end
  end
end
