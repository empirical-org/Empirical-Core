# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  RSpec.describe AdminUsageSnapshotEmailWorker, type: :worker do
    subject { described_class.new.perform(pdf_subscription_id) }

    let(:admin_report_filter_selection) { create(:admin_report_filter_selection, :with_default_filters) }
    let(:pdf_subscription) { create(:pdf_subscription, admin_report_filter_selection:) }
    let(:pdf_subscription_id) { pdf_subscription.id }
    let(:user) { pdf_subscription.user }
    let(:user_id) { user.id }

    before do
      allow(PdfSubscription).to receive(:find).with(pdf_subscription_id).and_return(pdf_subscription)
      allow(user).to receive(:school_or_district_premium?).and_return(school_or_district_premium)
    end

    context 'when the user does not have a premium account' do
      let(:school_or_district_premium) { false }

      it 'does not generate or send the PDF report' do
        expect(Pdfs::AdminUsageSnapshotReports::DataAggregator).not_to receive(:run)
        expect(Pdfs::FileBuilder).not_to receive(:run)
        expect(Pdfs::AdminUsageSnapshotReportUploader).not_to receive(:new)
        expect(PremiumHubUserMailer).not_to receive(:admin_usage_snapshot_report_pdf_email)

        subject
      end
    end

    context 'when the user has a premium account' do
      let(:school_or_district_premium) { true }
      let(:url) { 'http://example.com/uploader_url' }
      let(:uploader) { double('Pdfs::AdminUsageSnapshotReportUploader', store!: store, url:) }
      let(:data) { double('data') }
      let(:pdf_file) { double('pdf_file') }

      before do
        allow(Pdfs::AdminUsageSnapshotReportUploader).to receive(:new).with(user_id:).and_return(uploader)
        allow(Pdfs::AdminUsageSnapshotReports::DataAggregator).to receive(:run).and_return(data)
        allow(Pdfs::FileBuilder).to receive(:run).and_return(pdf_file)
      end

      context 'when PDF upload fails' do
        let(:store) { false }

        it { expect { subject }.to raise_error(described_class::CloudUploadError) }
      end

      context 'when PDF upload succeeds' do
        let(:store) { true }
        let(:download_url) { 'http://example.com/download.pdf' }
        let(:deliver_now_double) { double('PremiumHubUserMailer', deliver_now!: true) }

        before do
          allow(uploader)
            .to receive(:url)
            .with(query: described_class::RESPONSE_CONTENT_DISPOSITION)
            .and_return(download_url)

          allow(PremiumHubUserMailer)
            .to receive(:admin_usage_snapshot_report_pdf_email)
            .with(pdf_subscription:, download_url:)
            .and_return(deliver_now_double)

          allow(deliver_now_double).to receive(:deliver_now!)
        end

        it 'generates and sends the PDF report' do
          expect(deliver_now_double).to receive(:deliver_now!)

          subject
        end
      end
    end
  end
end
