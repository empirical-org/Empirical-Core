# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe PeriodQuery do

    let(:test_period_query) do
      Class.new(described_class) do
        def run
          run_query.map { |result| result['id'] }
        end

        def select_clause
          "SELECT DISTINCT classrooms.id"
        end

        def relevant_date_column
          "classrooms.created_at"
        end
      end
    end

    context 'external_api', :big_query_snapshot do
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

      let(:results) { test_period_query.run(**query_args, options: {runner: runner}) }

      it { expect(results).to match_array(classroom_ids) }

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

          it { expect(results).to match_array(classroom_ids[0]) }
        end

        context 'filter for one grade' do
          let(:classrooms) do
            [
              create(:classroom, grade: '1'),
              create(:classroom, grade: '2')
            ]
          end
          let(:filters) { { grades: [classrooms[0].grade] } }

          it { expect(results).to match_array(classroom_ids[0]) }
        end

        context 'filter for one teacher' do
          let(:filters) { { teacher_ids: [teachers[0].id] } }

          it { expect(results).to match_array(classroom_ids[0]) }
        end

        context 'filter for one classroom' do
          let(:filters) { { classroom_ids: [classrooms[0].id] } }

          it { expect(results).to match_array(classroom_ids[0]) }
        end
      end
    end
  end
end
