# frozen_string_literal: true

require 'rails_helper'

describe Snapshots::PremiumDownloadReportsWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:query) { 'create_csv_report_download' }
    let(:user_id) { create(:user).id }
    let(:timeframe) { { 'current_start' => '2023-01-01', 'current_end' => '2023-12-31' } }
    let(:school_ids) { [1, 2, 3] }
    let(:filters) { { 'filter1' => 'value1' } }
    let(:mock_payload) { double }
    let(:mock_csv) { "mock,csv,data" }
    let(:csv_tempfile) { Tempfile.new('mock.csv') }
    let(:headers_to_display) { [] }
    let(:default_params) { [query, user_id, timeframe, school_ids, headers_to_display, filters] }

    before do
      allow(Snapshots::UntruncatedDataExportQuery).to receive(:run).and_return(mock_payload)
      allow(Adapters::Csv::AdminPremiumDataExport).to receive(:to_csv_string).and_return(mock_csv)
      allow(Tempfile).to receive(:new).and_return(csv_tempfile)
    end

    context 'upload succeeds' do
      let(:mock_uploader) { double(store!: [], url: 'a_url') }

      before do
        allow(AdminReportCsvUploader).to receive(:new).and_return(mock_uploader)
      end

      it { expect { subject.perform(*default_params) }.not_to raise_error }
    end

    context 'upload fails' do
      let(:mock_uploader) { double(store!: false) }

      before do
        allow(AdminReportCsvUploader).to receive(:new).and_return(mock_uploader)
      end

      it do
        expect { subject.perform(*default_params) }.to raise_error(described_class::CloudUploadError)
      end
    end
  end
end
