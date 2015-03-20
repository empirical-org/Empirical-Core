require 'rails_helper'

describe CsvExporter::ActivitySession do
  include_context 'Activity Progress Report'
  let(:csv_exporter) { CsvExporter::ActivitySession.new }

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