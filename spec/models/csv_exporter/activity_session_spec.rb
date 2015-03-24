require 'rails_helper'

describe CsvExporter::ActivitySession do
  include_context 'Activity Progress Report'
  let(:csv_exporter) { CsvExporter::ActivitySession.new }

  describe '#header_row' do
    it 'returns an array of headers' do
      expect(csv_exporter.header_row).to eq(['app', 'activity', 'date', 'time_spent', 'standard', 'score', 'student'])
    end
  end

  describe '#data_row' do
    it 'returns an array of row data' do
      expected_row = [
        horshack_session.activity.classification.name,
        horshack_session.activity.name,
        horshack_session.completed_at.to_formatted_s(:quill_default),
        horshack_session.time_spent,
        horshack_session.activity.topic.name_prefix,
        horshack_session.percentage,
        horshack_session.user.name
      ]
      expect(csv_exporter.data_row(horshack_session)).to eq(expected_row)
    end
  end

  describe '#model_data' do
    subject { csv_exporter.model_data(mr_kotter, filters) }

    context 'filtering by classroom ID' do
      let(:filters) { { 'classroom_id' => sweathogs.id } }

      it 'retrieves filtered activity sessions' do
        expect(subject.size).to eq(sweathogs_sessions.size)
      end
    end

    context 'unfiltered' do
      let(:filters) { {} }

      it 'retrieves activity sessions without any filters' do
        expect(subject.to_a).to eq(all_sessions)
      end
    end
  end
end