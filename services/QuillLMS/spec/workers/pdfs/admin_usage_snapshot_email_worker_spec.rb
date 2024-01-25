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
      context 'when the user has a premium account' do
        let(:school_or_district_premium) { true }
        let(:url) { 'http://example.com/uploader_url' }
        let(:uploader) { double('Pdfs::AdminUsageSnapshotReportUploader') }
        let(:data) { double('data') }
        let(:pdf_file) { double('pdf_file', path: '/path/to/pdf') }

        before do
          allow(Pdfs::AdminUsageSnapshotReportUploader).to receive(:new).with(user_id:).and_return(uploader)
          allow(Pdfs::AdminUsageSnapshotReports::DataAggregator).to receive(:run).and_return(data)
          allow(Pdfs::FileBuilder).to receive(:run).and_yield(pdf_file)
          allow(uploader).to receive(:store!).with(pdf_file)
        end

        context 'when uploader.store! returns non-nil' do
          it 'uploads the PDF and retrieves the download URL' do
            expect(uploader).to receive(:store!).with(pdf_file).and_return({})
            expect(uploader).to receive(:url).with(query: described_class::RESPONSE_CONTENT_DISPOSITION).and_return(url)

            subject
          end
        end

        context 'when uploader.store! return nil' do
          before { allow(uploader).to receive(:store!).with(pdf_file).and_return(nil) }

          it { expect { subject }.to raise_error(described_class::CloudUploadError) }
        end
      end
    end
  end
end
