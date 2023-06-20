# frozen_string_literal: true

module Snapshots
  class ActiveStudentsQuery < ActivitySessionCountQuery
    def select_clause
      "SELECT COUNT(DISTINCT activity_sessions.user_id) AS count"
    end

    def relevant_date_column
      "activity_sessions.updated_at"
    end
  end
end
