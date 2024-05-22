# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ClassroomsCreatedQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Period CTE'

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools
        ]
      end

      it { expect(results).to eq(count: classrooms.length) }

      context 'with classrooms created outside of timeframe' do
        before do
          classrooms.each { |classroom| classroom.update(created_at: timeframe_start - 1.day) }
        end

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
