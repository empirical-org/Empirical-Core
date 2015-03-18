require 'rails_helper'

describe CsvExport, :type => :model do

  include_context 'Activity Progress Report'
  let(:csv_export) { CsvExport.new }

  before do
    csv_export.type = :activity_sessions
    csv_export.teacher = mr_kotter
  end

  describe '#model_data' do
    context 'for activity sessions' do
      before do
      end

      context 'filtering by classroom ID' do
        before do
          csv_export.filters = {
            :classroom_id => sweathogs.id
          }
        end

        it 'retrieves filtered activity sessions'
      end

      context 'unfiltered' do
        it 'retrieves activity sessions without any filters' do
          expect(csv_export.model_data.to_a).to eq(all_sessions)
        end
      end
    end
  end

  describe '#generate_csv' do
    it 'writes a csv to temporary storage' do
      file = csv_export.generate_csv
      expect(file.length).to be > 0
      file.rewind
      expect(file.readline).to eq("app,activity,date,time_spent,standard,score,student\n")
      expected_row = [
        horshack_session.activity.classification.name,
        horshack_session.activity.name,
        horshack_session.completed_at.to_formatted_s(:quill_default),
        horshack_session.time_spent,
        horshack_session.activity.topic.name_prefix,
        horshack_session.percentage,
        horshack_session.user.name
      ]
      expect(file.readline).to eq(expected_row.join(',') + "\n")
    end
  end

  describe '#export' do
    context 'when not exported yet' do
      it 'generates a CSV and uploads it to carrierwave' do
        csv_export.export
        # Bucket should have "dev" suffix in test environment
        expect(csv_export.csv_file.url).to match(/dev\/uploads\/csv_export\/csv_file\/progress_report.*\.csv/)
      end
    end

    context 'when already exported before' do
      before do
        csv_export.emailed_at = Date.current
      end

      it 'does nothing' do
        csv_export.export
      end
    end
  end
end
