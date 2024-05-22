# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe DiagnosticAggregateQuery do
    include_context 'Admin Diagnostic Aggregate CTE'

    let(:test_admin_diagnostic_query) do
      Class.new(described_class) do
        def specific_select_clause
          <<-SQL
            COUNT(classroom_units.id) AS classroom_unit_count,
            COUNT(users.id) AS teacher_count,
            0 AS percentage
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

        private def rollup_aggregation_hash
          {
            classroom_unit_count: sum_aggregate,
            teacher_count: average_aggregate(:classroom_unit_count),
            percentage: percentage_aggregate(:classroom_unit_count, :teacher_count)
          }
        end
      end
    end

    let(:number_grades) { Array(1..12) }
    let(:non_number_grades) { Classroom::GRADE_INTEGERS.keys.map(&:to_s) }
    let(:grades) { number_grades + non_number_grades + ['Other', nil] }
    let(:classrooms) { grades.map { |grade| create(:classroom, grade: grade) } }

    let(:activities) { [pre_diagnostic] }
    let(:units) { activities.map { |a| create(:unit, activities: activities) } }
    let(:unit_activities) { units.map(&:unit_activities) }
    let(:classroom_units) do
      classrooms.map do |classroom|
        units.map { |unit| create(:classroom_unit, classroom: classroom, unit: unit) }
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
    let(:results) { test_admin_diagnostic_query.run(**query_args, aggregation: aggregation_arg, runner: runner) }

    context 'external_api', :big_query_snapshot do
      it { expect(results.length).to be(activities.length) }
      it { expect(results.first[:group_by]).to eq(aggregation_arg) }
      it { expect(results.first[:diagnostic_name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:classroom_unit_count]).to eq(classroom_units.length) }
      it { expect(results.first[:teacher_count]).to eq(teachers.length / classroom_units.length) }
      it { expect(results.first[:percentage]).to eq(classroom_units.length / teachers.length * 100) }

      context 'aggregate_rows ordering' do
        it { expect(results.first[:aggregate_rows].first[:name]).to eq('Kindergarten') }
        it { expect(results.first[:aggregate_rows].second[:name]).to eq('Grade 1') }
      end

      context 'multiple diagnostics' do
        let(:pre_diagnostic2) { create(:diagnostic_activity, id: described_class::DIAGNOSTIC_ORDER_BY_ID.last) }
        let(:activities) { [pre_diagnostic, pre_diagnostic2] }

        it { expect(results.length).to be(activities.length) }
        it { expect(results.first[:diagnostic_id]).to eq(pre_diagnostic.id) }
        it { expect(results.last[:diagnostic_id]).to eq(pre_diagnostic2.id) }
      end

      context 'activities not in DIAGNOSTIC_ORDER_BY_ID are ignored' do
        let(:non_diagnostic) { create(:activity, id: 1) }
        let(:activities) { [pre_diagnostic, non_diagnostic] }

        it { expect(results.pluck(:diagnostic_id)).not_to include(non_diagnostic.id) }
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
        let(:expected_grade_name_order) { ['Kindergarten'] + number_grade_names + ['University', 'PostGraduate', 'Other', 'No grade selected'] }
        let(:kindergarten_classroom_units) { classroom_units.filter { |classroom_unit| classroom_unit.classroom.grade == 'Kindergarten' } }

        it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(expected_grade_name_order) }
        it { expect(results.first[:aggregate_rows].first[:classroom_unit_count]).to eq(kindergarten_classroom_units.length) }
      end

      context 'aggregation by teacher' do
        let(:aggregation_arg) { 'teacher' }
        let(:expected_teacher_name_order) { teachers.map(&:name).sort_by { |teacher| teacher.split.last } }

        it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(expected_teacher_name_order) }

        # The User factory gives people names like "FistName LastName 1", but that's not terribly useful for testing sorting by last name
        context 'teachers have real-ish names' do
          before do
            # Because teachers are derived from classrooms in shared context, it's easier to control their names with this rather than overriding `let`
            teachers.each { |teacher| teacher.update(name: Faker::Name.name) }
          end

          it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(expected_teacher_name_order) }
        end

        context 'teachers have the same name' do
          before do
            # Because teachers are derived from classrooms in shared context, it's easier to control their names with this rather than overriding `let`
            teachers.each { |teacher| teacher.update(name: 'Same Name') }
          end

          it { expect(results.first[:aggregate_rows].length).to eq(teachers.length) }
        end
      end

      context 'aggregation by classroom' do
        let(:aggregation_arg) { 'classroom' }
        let(:expected_classroom_name_order) { classrooms.map(&:name).sort }

        it { expect(results.first[:aggregate_rows].pluck(:name)).to eq(expected_classroom_name_order) }

        context 'classrooms have the same name' do
          let(:classrooms) { create_list(:classroom, num_classrooms, name: 'Same Name') }

          it { expect(results.first[:aggregate_rows].length).to eq(classrooms.length) }
        end
      end
    end
  end
end
