# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe AverageActivitiesCompletedPerStudentQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      let(:average_activities_completed_per_student) { activity_sessions.count / activity_sessions.map(&:user_id).uniq.count.to_f }

      it { expect(results).to eq [{'count' => average_activities_completed_per_student }] }
    end
  end
end
