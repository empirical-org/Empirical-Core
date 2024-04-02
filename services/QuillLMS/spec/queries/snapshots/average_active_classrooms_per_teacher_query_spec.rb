# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe AverageActiveClassroomsPerTeacherQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:user_logins) { teachers.map { |teacher| create(:user_login, user: teacher) } }
      let(:cte_records) do
        [
          period_query_cte_records,
          teachers,
          classroom_units,
          activity_sessions,
          user_logins,
          users,
          activities
        ]
      end

      let(:average_active_classrooms_per_teacher) { classrooms.count / teachers.count.to_f }

      it { expect(results).to eq(count: average_active_classrooms_per_teacher) }
    end
  end
end
