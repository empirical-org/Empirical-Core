# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe AverageActiveStudentsPerClassroomQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:average_active_classrooms_per_teacher) { activity_sessions.map(&:user_id).uniq.count / classrooms.count.to_f }

      it { expect(results).to eq(count: average_active_classrooms_per_teacher) }
    end
  end
end
