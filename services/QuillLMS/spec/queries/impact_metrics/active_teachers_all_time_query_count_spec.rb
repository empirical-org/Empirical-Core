# frozen_string_literal: true

require 'rails_helper'

module ImpactMetrics
  describe ActiveTeachersAllTimeCountQuery do
    context 'for active teachers all time', :big_query_snapshot do
      include_context 'QuillBigQuery TestRunner Setup'

      let(:num_teachers) { 10 }
      let(:users) { create_list(:teacher, num_teachers) }
      let(:units) { users.map { |user| create(:unit, user: user) } }
      let(:classroom_units) { units.map { |unit| create(:classroom_unit, unit: unit) } }
      let(:activity_sessions) { classroom_units.map { |classroom_unit| create_list(:activity_session, 10, classroom_unit: classroom_unit) } }

      let(:cte_records) { [users, units, classroom_units, activity_sessions] }
      let(:query_args) { {} }

      context 'only one teacher with activity_sessions' do
        let(:activity_sessions) { [create_list(:activity_session, 10, classroom_unit: classroom_units.first)] }

        it { expect(results.length).to eq(activity_sessions.length) }
      end
    end
  end
end
