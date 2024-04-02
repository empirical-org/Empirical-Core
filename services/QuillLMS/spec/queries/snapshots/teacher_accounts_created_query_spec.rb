# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TeacherAccountsCreatedQuery do
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

      it { expect(results).to eq(count: teachers.length) }

      context 'when users are coteachers instead of classroom owners' do
        before do
          classrooms_teachers.each { |classroom_teacher| classroom_teacher.update(role: ClassroomsTeacher::ROLE_TYPES[:coteacher]) }
        end

        it { expect(results).to eq(count: teachers.length) }
      end

      context 'with users created outside of timeframe' do
        before do
          teachers.each { |teacher| teacher.update(created_at: timeframe_start - 1.day) }
        end

        it { expect(results).to eq(count: 0) }
      end

      context 'teachers who do not have classrooms' do
        # Unrelated models required to be in the CTE so the query has relevant tables to look at
        let(:unrelated_classrooms) { create(:classroom) }
        let(:unrelated_classrooms_teachers) { create(:classrooms_teacher, classroom: unrelated_classrooms) }
        let(:cte_records) do
          [
            unrelated_classrooms,
            teachers,
            unrelated_classrooms_teachers,
            schools_users,
            schools
          ]
        end
        let(:query_args) do
          {
            timeframe_start: timeframe_start,
            timeframe_end: timeframe_end,
            school_ids: school_ids
          }
        end

        it { expect(results).to eq(count: teachers.length) }
      end
    end
  end
end
