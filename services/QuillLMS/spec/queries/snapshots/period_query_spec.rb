# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe PeriodQuery do

    let(:test_period_query) do
      Class.new(described_class) do
        def run
          run_query.pluck(:id)
        end

        def select_clause
          "SELECT classrooms.id"
        end

        def relevant_date_column
          "classrooms.created_at"
        end
      end
    end

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Period CTE'

      let(:base_cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools
        ]
      end

      let(:cte_records) { base_cte_records }

      let(:results) { test_period_query.run(**query_args, runner: runner) }

      it { expect(results).to match_array(classroom_ids) }

      context 'classroom with co teachers' do
        let(:coteacher_classrooms_teachers) { classrooms.map { |classroom| create(:classrooms_teacher, classroom: classroom, role: ClassroomsTeacher::ROLE_TYPES[:coteacher]) } }
        let(:coteachers) { coteacher_classrooms_teachers.map { |ct| ct.user } }
        let(:coteacher_schools_users) { coteachers.map { |coteacher| create(:schools_users, user: coteacher, school: schools.first)  } }

        let(:teacher_ids) { nil }
        let(:cte_records) { base_cte_records + [coteacher_classrooms_teachers, coteachers, coteacher_schools_users] }


        it { expect(results).to match_array(classroom_ids) }
      end

      context 'filter params' do
        let(:filters) { {} }
        let(:query_args) do
          {
            timeframe_start: timeframe_start,
            timeframe_end: timeframe_end,
            school_ids: school_ids
          }.merge(filters)
        end

        it { expect(results).to match_array(classroom_ids) }

        context 'filter for one school' do
          let!(:school_ids) { [schools[0].id] }

          it { expect(results).to match_array([classroom_ids[0]]) }
        end

        context 'filter for one grade' do
          let(:classrooms) do
            [
              create(:classroom, grade: '1'),
              create(:classroom, grade: '2')
            ]
          end
          let(:filters) { { grades: [classrooms[0].grade] } }

          it { expect(results).to match_array([classroom_ids[0]]) }
        end

        context 'filter for null grade' do
          let(:classroom_with_grade) { create(:classroom, grade: 1) }
          let(:classroom_without_grade) { create(:classroom, grade: nil) }
          let(:classrooms) { [classroom_with_grade, classroom_without_grade] }

          let(:filters) { { grades: ['null'] } }

          it { expect(results).to eq([classroom_without_grade.id]) }
        end

        context 'filter for one teacher' do
          let(:filters) { { teacher_ids: [teachers[0].id] } }

          it { expect(results).to match_array([classroom_ids[0]]) }
        end

        context 'filter for one classroom' do
          let(:filters) { { classroom_ids: [classrooms[0].id] } }

          it { expect(results).to match_array([classroom_ids[0]]) }
        end

        context 'timeframe filters' do
          let(:classrooms) { create_list(:classroom, num_classrooms, created_at: DateTime.current - 1.day) }
          let(:timeframe) { Snapshots::Timeframes.calculate_timeframes(Snapshots::Timeframes::DEFAULT_TIMEFRAME) }
          let(:query_args) do
            {
              timeframe_start: timeframe[0],
              timeframe_end: timeframe[1],
              school_ids: school_ids
            }
          end

          it { expect(results).to match_array(classroom_ids) }
        end
      end
    end
  end
end
