# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe PreDiagnosticAssignedQuery do
    include_context 'Admin Diagnostic Aggregate CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:unit) { create(:unit, activities: [pre_diagnostic]) }
      let(:unit_activities) { unit.unit_activities }
      let(:students) { classrooms.map { |classroom| create(:student, student_in_classroom: [classroom]) } }
      let(:classroom_units) { students.map { |student| create(:classroom_unit, classroom: student.student_in_classroom.first, assigned_student_ids: [student.id], unit: unit) } }
      let(:grade_names) { classrooms.map(&:grade).uniq.map { |g| g.to_i > 0 ? "Grade #{g}" : g } }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          classroom_units,
          students,
          pre_diagnostic,
          unit_activities
        ]
      end

      it { expect(results.first[:name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:aggregate_rows].map { |row| row[:name] }).to match_array(grade_names) }
      it { expect(results.first[:pre_students_assigned]).to eq(students.length) }

      context 'student assigned to multiple instances of the same diagnostic' do
        let(:classroom_units) do
          [
            create(:classroom_unit, classroom: classrooms.first, unit: unit, assigned_student_ids: students.pluck(:id)),
            create(:classroom_unit, classroom: classrooms.second, unit: unit, assigned_student_ids: students.pluck(:id))
          ]
        end

        it { expect(results.first[:pre_students_assigned]).to eq(students.length * 2) }
      end

      context 'no relevant classroom_units' do
        # create a classroom unit not attached to relevant activities
        let(:classroom_units) { create(:classroom_unit) }

        it { expect(results).to eq([]) }
      end

      context 'no students assigned to classroom_unit' do
        let(:classroom_units) { [create(:classroom_unit, classroom: classrooms.first, assigned_student_ids: [], unit: unit)] }

        it { expect(results).to eq([]) }
      end
    end
  end
end
