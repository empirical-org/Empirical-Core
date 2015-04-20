require 'rails_helper'

describe CsvExport, :type => :model do

  include_context 'Activity Progress Report'
  let(:csv_export) { CsvExport.new }

  let(:export_type) { 'activity_sessions' }
  let(:filters) { {} }

  before do
    csv_export.export_type = export_type
    csv_export.teacher = mr_kotter
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
    context 'activity sessions' do
      let(:export_type) { 'activity_sessions' }
      it_behaves_like "CSV Export Type"
    end

    context 'standards: all classrooms' do
      let(:export_type) { 'standards_classrooms' }
      it_behaves_like "CSV Export Type"
    end

    context 'standards: students by classroom' do
      let(:filters) { { classroom_id: sweathogs.id } }
      let(:export_type) { 'standards_classroom_students' }
      it_behaves_like "CSV Export Type"
    end

    context 'standards: topics by classroom' do
      let(:filters) { { classroom_id: sweathogs.id } }
      let(:export_type) { 'standards_classroom_topics' }
      it_behaves_like "CSV Export Type"
    end

    context 'standards: topics by student' do
      let(:filters) { { student_id: horshack.id } }
      let(:export_type) { 'standards_student_topics' }
      it_behaves_like "CSV Export Type"
    end

    context 'standards: students by topic' do
      let!(:topic) { FactoryGirl.create(:topic)}
      let(:filters) { { topic_id: topic.id } }
      let(:export_type) { 'standards_topic_students' }
      it_behaves_like "CSV Export Type"
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
          expect(csv_export.csv_file.url).to match(/uploads\/csv_export\/csv_file\/.*\.csv/)
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
