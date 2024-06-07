# frozen_string_literal: true

require 'rails_helper'

describe Snapshots::PremiumDownloadReportsWorker do
  subject { described_class.new.perform(*default_params) }

  describe '#perform' do
    let(:query) { 'create_csv_report_download' }
    let(:user) { create(:user) }
    let(:user_id) { user.id }
    let(:timeframe) { { 'timeframe_start' => '2023-01-01', 'timeframe_end' => '2023-12-31' } }
    let(:school_ids) { [1, 2, 3] }
    let(:filters) { { 'filter1' => 'value1' } }
    let(:mock_payload) { double }
    let(:mock_csv) { "mock,csv,data" }
    let(:csv_tempfile) { Tempfile.new('mock.csv') }
    let(:s3_url) { 'https://www.example.com' }
    let(:headers_to_display) { [] }
    let(:default_params) { [query, user_id, timeframe, school_ids, headers_to_display, filters] }
    let(:query_params) do
      {
        timeframe_start: DateTime.parse(timeframe['timeframe_start']),
        timeframe_end: DateTime.parse(timeframe['timeframe_end']),
        school_ids:,
        user:
      }.merge(filters.symbolize_keys)
    end
    let(:mock_mailer) { double }

    before do
      allow(User).to receive(:find).with(user_id).and_return(user)
    end

    it do
      expect(Snapshots::UntruncatedDataExportQuery).to receive(:run).with(**query_params).and_return(mock_payload)
      expect(Adapters::Csv::AdminPremiumDataExport).to receive(:to_csv_string).with(mock_payload, headers_to_display).and_return(mock_csv)
      expect(UploadToS3).to receive(:run).with(user, mock_csv).and_return(s3_url)
      expect(PremiumHubUserMailer).to receive(:admin_premium_download_report_email).with(user.first_name, s3_url, user.email).and_return(mock_mailer)
      expect(mock_mailer).to receive(:deliver_now!)

      subject
    end
  end
end
