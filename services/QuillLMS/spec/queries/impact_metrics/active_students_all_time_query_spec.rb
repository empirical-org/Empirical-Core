# frozen_string_literal: true

require 'rails_helper'

module ImpactMetrics
  describe ActivitiesAllTimeQuery do
    context 'for activities finished all time', :big_query_snapshot do
      include_context 'QuillBigQuery TestRunner Setup'

      let(:students) { create_list(:student, 20)}
      let(:inactive_students) { create_list(:student, 10)}
      let(:activity_sessions) { students.map { |s| create(:activity_session, :finished, user: s) }}
      let(:unfinished_activity_sessions) { inactive_students.map { |s| create(:activity_session, state: "started", user: s) }}
      let(:query_args) { {} }

      let(:cte_records) {
        [
          students,
          inactive_students,
          activity_sessions,
          unfinished_activity_sessions
        ]
      }

      it { expect(results).to eq([{"count" => students.length}]) }
    end
  end
end
