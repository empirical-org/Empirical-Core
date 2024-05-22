# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe StudentLearningHoursQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:total_timespent) { activity_sessions.sum(&:timespent) / 3600.0 }

      it { expect(results).to eq(count: total_timespent) }

      context 'null total timespent' do
        let(:activity_sessions) do
          classroom_units.map do |classroom_unit|
            create(:activity_session, classroom_unit: classroom_unit, timespent: nil)
          end
        end

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
