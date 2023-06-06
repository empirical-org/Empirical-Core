# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActivitiesAssignedQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      let(:unit_activities) { classroom_units.map { |classroom_unit| create(:unit_activity, unit: classroom_unit.unit) } }
      let(:cte_records) { count_query_cte_records << unit_activities }

      let(:num_activities_assigned) { unit_activities.count }

      it { expect(results).to eq(count: num_activities_assigned) }
    end
  end
end
