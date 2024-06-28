# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe OverviewCsvGenerator do
    subject { described_class.run(data, specified_columns:) }
    let(:rows) { CSV.parse(subject).map { |row| row.join(',') } }

    let(:specified_columns) { data.first.except(:aggregate_rows).keys }
    let(:diagnostic_name1) { 'Starter Diagnostic' }
    let(:diagnostic_name2) { 'Intermediate Diagnotic' }
    let(:aggregate_row_name1) { 'Grade 9' }
    let(:assigned1) { 10 }
    let(:assigned2) { 0 }
    let(:completed1) { 5 }
    let(:completed2) { 0 }
    let(:data) do
      [
        {
          diagnostic_name: diagnostic_name1,
          pre_students_assigned: assigned1,
          pre_students_completed: completed1,
          aggregate_rows: aggregate_rows
        },
        {
          diagnostic_name: diagnostic_name2,
          pre_students_assigned: assigned2,
          pre_students_completed: completed2
        }
      ]
    end
    let(:aggregate_rows) do
      [
        {
          name: aggregate_row_name1,
          pre_students_assigned: assigned1,
          pre_students_completed: completed1,
        }
      ]
    end

    let(:first_grouped_row) { [diagnostic_name1.upcase, assigned1, completed1].join(',') }
    let(:first_sub_row) { [aggregate_row_name1, assigned1, completed1].join(',') }
    let(:second_grouped_row) { [diagnostic_name2.upcase, assigned2, completed2].join(',') }

    it { expect(rows.third).to eq(first_grouped_row) }
    it { expect(rows.fourth).to eq(first_sub_row) }
    it { expect(rows.fifth).to eq(second_grouped_row) }
  end
end
