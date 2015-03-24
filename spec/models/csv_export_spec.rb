require 'rails_helper'

describe CsvExport, :type => :model do

  include_context 'Activity Progress Report'
  let(:csv_export) { CsvExport.new }

  before do
    csv_export.export_type = 'activity_sessions'
    csv_export.teacher = mr_kotter
  end

  describe '#generate_csv' do
    it 'writes a csv to temporary storage' do
      file = csv_export.generate_csv
      expect(file.length).to be > 0
      file.rewind
      lines = file.readlines
      expect(lines.first).to eq("Student,Activity,Score,Time Spent,Standard Level,Standard,App,Date\n")
      # Just test that it generates the right # of lines.
      # The exact content of the rows is tested in the exporter spec.
      expect(lines.size).to eq(all_sessions.size + 1)
    end
  end

  describe '#export' do
    context 'when not exported yet' do
      it 'generates a CSV and uploads it to carrierwave' do
        csv_export.export!
        # Bucket should have "dev" suffix in test environment
        expect(csv_export.csv_file.url).to match(/dev\/uploads\/csv_export\/csv_file\/progress_report.*\.csv/)
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
