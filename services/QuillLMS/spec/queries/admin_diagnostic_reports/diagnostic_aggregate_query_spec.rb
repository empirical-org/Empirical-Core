# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe DiagnosticAggregateQuery do
    include_context 'Snapshots Period CTE'

    let(:test_admin_diagnostic_query) do
      Class.new(described_class) do
        def specific_select_clause
          <<-SQL
            COUNT(classroom_units.id) AS classroom_unit_count,
            COUNT(users.id) AS teacher_count
          SQL
        end

        def from_and_join_clauses
          super + <<-SQL
            JOIN lms.unit_activities
              ON classroom_units.unit_id = unit_activities.unit_id
            JOIN lms.activities
              ON unit_activities.activity_id = activities.id
          SQL
        end

        def relevant_date_column
          "classroom_units.created_at"
        end

        private def aggregate_diagnostic(rows)
          {
            classroom_unit_count: roll_up_sum(rows, :classroom_unit_count),
            average_classroom_units_per_teacher: roll_up_average(rows, :classroom_unit_count, :teacher_count)
          }
        end
      end
    end

    let(:number_grades) { Array(1..12) }
    let(:non_number_grades) { Classroom::GRADE_INTEGERS.keys.map(&:to_s) }
    let(:grades) { number_grades + non_number_grades + [nil] }
    let(:classrooms) { grades.map { |grade| create(:classroom, grade: grade) } }

    let(:pre_diagnostic) { create(:diagnostic_activity, id: described_class::DIAGNOSTIC_ORDER_BY_ID.first) }
    let(:activities) { [pre_diagnostic] }
    let(:units) { activities.map { |a| create(:unit, activities: activities) } }
    let(:unit_activities) { units.map(&:unit_activities) }
    let(:classroom_units) do
      classrooms.map do |classroom|
        units.map { |unit| create(:classroom_unit, classroom: classroom, unit:unit) }
      end.flatten
    end

    let(:cte_records) do
      [
        schools,
        schools_users,
        classrooms_teachers,
        classrooms,
        classroom_units,
        teachers,
        unit_activities,
        activities
      ]
    end

    let(:query_args) do
      {
        timeframe_start: timeframe_start,
        timeframe_end: timeframe_end,
        school_ids: school_ids,
      }
    end
    let(:aggregation_arg) { 'grade' }
    let(:results) { test_admin_diagnostic_query.run(**query_args, aggregation: aggregation_arg, runner: runner) }

    context 'external_api', :big_query_snapshot do
      it { expect(results.length).to be(activities.length) }
      it { expect(results.first[:group_by]).to eq(aggregation_arg) }
      it { expect(results.first[:name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:classroom_unit_count]).to eq(classroom_units.length) }
      it { expect(results.first[:average_classroom_units_per_teacher]).to eq(classroom_units.length / teachers.length) }

      context 'aggregate_rows ordering' do
        it { expect(results.first[:aggregate_rows].first[:name]).to eq('Kindergarten') }
        it { expect(results.first[:aggregate_rows].second[:name]).to eq('Grade 1') }
      end

      context 'multiple diagnostics' do
        let(:pre_diagnostic2) { create(:diagnostic_activity, id: described_class::DIAGNOSTIC_ORDER_BY_ID.last) }
        let(:activities) { [pre_diagnostic, pre_diagnostic2] }

        it { expect(results.length).to be(activities.length) }
        it { expect(results.first[:id]).to eq(pre_diagnostic.id) }
        it { expect(results.last[:id]).to eq(pre_diagnostic2.id) }
      end

      context 'activities not in DIAGNOSTIC_ORDER_BY_ID are ignored' do
        let(:non_diagnostic) { create(:activity, id: 1) }
        let(:activities) { [pre_diagnostic, non_diagnostic] }

        it { expect(results.pluck(:id)).not_to include(non_diagnostic.id) }
      end

      context 'invalid aggregation arg' do
        let(:aggregation_arg) { 'NOT_VALID' }

        it do
          expect { results }.to raise_error(described_class::InvalidAggregationError)
        end
      end

      context 'aggregation by grade' do
        let(:aggregation_arg) { 'grade' }
        let(:number_grade_names) { number_grades.map { |grade| "Grade #{grade}" } }
        # 'No grade selected' is how we expect the queries to represent NULL grades
        let(:ordered_grade_names) { ['Kindergarten'] + number_grade_names + ['University', 'PostGraduate', 'No grade selected'] }
        let(:kindergarten_classroom_units) { classroom_units.filter { |classroom_unit| classroom_unit.classroom.grade == 'Kindergarten' } }

        it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(ordered_grade_names) }
        it { expect(results.first[:aggregate_rows].first[:classroom_unit_count]).to eq(kindergarten_classroom_units.length) }
      end

      context 'aggregation by teacher' do
        let(:aggregation_arg) { 'teacher' }
        let(:expected_teacher_name_order) { teachers.map(&:name).sort }

        it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(expected_teacher_name_order) }
      end

      context 'aggregation by classroom' do
        let(:aggregation_arg) { 'classroom' }
        let(:expected_classroom_name_order) { classrooms.map(&:name).sort }

        it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(expected_classroom_name_order) }

      end
    end
  end
end
