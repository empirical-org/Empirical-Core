# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe StudentAccountsCreatedQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Period CTE'

      let(:students_classrooms) { classrooms.map { |classroom| create(:students_classrooms, classroom: classroom) } }
      let(:students) { students_classrooms.map(&:student) }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools,
          students_classrooms,
          students
        ]
      end

      it { expect(results).to eq(count: students.length) }

      context 'with users created outside of timeframe' do
        before do
          students.each { |student| student.update(created_at: timeframe_start - 1.day) }
        end

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
