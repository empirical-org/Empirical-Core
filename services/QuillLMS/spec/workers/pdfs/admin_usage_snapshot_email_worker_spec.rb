# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  RSpec.describe AdminUsageSnapshotEmailWorker, type: :worker do
    let(:pdf_subscription) { create(:pdf_subscription) }
    let(:user) { pdf_subscription.user }
    let(:pdf_subscription_id) { pdf_subscription.id }

    describe '#perform' do
      let(:data) { double('data') }
      let(:pdf_file) { double('pdf_file') }
      let(:uploader) { double('Pdfs::AdminUsageSnapshotReportUploader', store!: true, url: 'http://example.com/download.pdf') }

      before do
        allow(Pdfs::AdminUsageSnapshotReports::DataAggregator).to receive(:run).and_return(data)
        allow(Pdfs::FileBuilder).to receive(:run).and_return(pdf_file)
        allow(Pdfs::AdminUsageSnapshotReportUploader).to receive(:new).and_return(uploader)
        allow(PremiumHubUserMailer).to receive_message_chain(:admin_usage_snapshot_report_pdf_email, :deliver_now!)
      end

      context 'when the user has a premium account' do
        before do
          allow(user).to receive(:school_or_district_premium?).and_return(true)
        end

        it 'generates and sends the PDF report' do
          subject.perform(pdf_subscription_id)

          expect(Pdfs::AdminUsageSnapshotReports::DataAggregator).to have_received(:run).with(pdf_subscription.admin_report_filter_selection)
          expect(Pdfs::FileBuilder).to have_received(:run).with(hash_including(data: data, template: Pdfs::AdminUsageSnapshotEmailWorker::PDF_TEMPLATE))
          expect(uploader).to have_received(:store!).with(pdf_file)
          expect(PremiumHubUserMailer).to have_received(:admin_usage_snapshot_report_pdf_email).with(hash_including(pdf_subscription: pdf_subscription, download_url: 'http://example.com/download.pdf'))
        end
      end

      context 'when the user does not have a premium account' do
        before do
          allow(user).to receive(:school_or_district_premium?).and_return(false)
        end

        it 'does not generate or send the PDF report' do
          subject.perform(pdf_subscription_id)

          expect(Pdfs::AdminUsageSnapshotReports::DataAggregator).not_to have_received(:run)
          expect(Pdfs::FileBuilder).not_to have_received(:run)
          expect(uploader).not_to have_received(:store!)
          expect(PremiumHubUserMailer).not_to have_received(:admin_usage_snapshot_report_pdf_email)
        end
      end

      context 'when the PDF upload fails' do
        before do
          allow(user).to receive(:school_or_district_premium?).and_return(true)
          allow(uploader).to receive(:store!).and_return(false)
        end

        it 'raises a CloudUploadError' do
          expect { subject.perform(pdf_subscription_id) }.to raise_error(Pdfs::AdminUsageSnapshotEmailWorker::CloudUploadError)
        end
      end
    end
  end
end
