# frozen_string_literal: true

# == Schema Information
#
# Table name: csv_exports
#
#  id          :integer          not null, primary key
#  csv_file    :string(255)
#  emailed_at  :datetime
#  export_type :string(255)
#  filters     :json
#  created_at  :datetime
#  updated_at  :datetime
#  teacher_id  :integer
#
require 'rails_helper'

describe CsvExport, type: :model do

  include_context 'Activity Progress Report'
  let(:csv_export) { CsvExport.new }

  let(:export_type) { 'activity_sessions' }
  let(:filters) { {} }

  before do
    csv_export.export_type = export_type
    csv_export.teacher = teacher
    csv_export.filters = filters
  end

  shared_examples_for "CSV Export Type" do
    it 'is valid' do
      expect(csv_export).to be_valid
    end

    it 'works' do
      expect { csv_export.generate_csv }.to_not raise_error
    end
  end

  describe 'export types' do

    context 'invalid type' do
      let(:csv_export1) { CsvExport.new }

      it 'should add error to the object' do
        expect(csv_export1.save).to eq false
        expect(csv_export1.errors.messages).to include(:export_type=>["is not included in the list"])
      end
    end

    context 'activity sessions' do
      let(:export_type) { 'activity_sessions' }

      it_behaves_like "CSV Export Type"
    end

    context 'standards: all classrooms' do
      let(:export_type) { 'standards_classrooms' }

      it_behaves_like "CSV Export Type"
    end

    context 'standards: students by classroom' do
      let(:filters) { { classroom_id: classroom_one.id } }
      let(:export_type) { 'standards_classroom_students' }

      it_behaves_like "CSV Export Type"
    end

    context 'standards: standards by classroom' do
      let(:filters) { { classroom_id: classroom_one.id } }
      let(:export_type) { 'standards_classroom_standards' }

      it_behaves_like "CSV Export Type"
    end

    context 'standards: standards by student' do
      let(:filters) { { student_id: student_in_classroom_one.id } }
      let(:export_type) { 'standards_student_standards' }

      it_behaves_like "CSV Export Type"
    end

    context 'standards: students by standard' do
      let!(:standard) { create(:standard)}
      let(:filters) { { standard_id: standard.id } }
      let(:export_type) { 'standards_standard_students' }

      it_behaves_like "CSV Export Type"
    end
  end

  describe '#mark_sent!' do
    let(:csv_export1) { create(:csv_export) }
    let(:time) { Time.utc('100') }

    before { allow(Time).to receive(:current).and_return(time) }

    it 'should set the emailed at as the current time' do
      csv_export1.mark_sent!
      expect(csv_export1.emailed_at).to eq(time)
    end
  end

  context 'with a valid export type' do
    describe '#generate_csv' do
      it 'writes a csv to temporary storage' do
        file = csv_export.generate_csv
        expect(file.length).to be > 0
        file.rewind
        lines = file.readlines
        expect(lines.first).to eq("Page Title,Student,Date,Activity,Score,Standard Level,Standard,App\n")
        # Just test that it generates the right # of lines.
        # The exact content of the rows is tested in the exporter spec.
        expect(lines.size).to eq(all_sessions.size + 1)
      end
    end

    describe '#export' do
      context 'when not exported yet' do
        it 'generates a CSV and uploads it to carrierwave' do
          csv_export.export!
          # Actual filename is tested in CsvUploader spec
          expect(csv_export.csv_file.url).to match(%r{uploads/csv_export/csv_file/.*\.csv})
        end
      end

      context 'when already exported before' do
        before do
          csv_export.emailed_at = Date.current
        end

        it 'does nothing' do
          csv_export.export!
          expect(csv_export.csv_file.url).to be_nil
        end
      end
    end
  end

end
