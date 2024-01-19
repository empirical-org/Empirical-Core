# frozen_string_literal: true

require 'rails_helper'

# TODO
RSpec.describe Pdfs::SendMonthlySubscriptionsWorker, type: :worker do
  describe '#perform' do
    let(:monthly_subscription) { create(:pdf_subscription, frequency: PdfSubscription::MONTHLY) }

    before do
      create_list(:pdf_subscription, 2, frequency: PdfSubscription::MONTHLY)
      allow(PdfSubscription).to receive(:monthly).and_return(PdfSubscription.monthly)
      allow(Pdfs::AdminUsageSnapshotEmailWorker).to receive(:perform_async)
    end

    it 'enqueues a job for each monthly subscription' do
      subject.perform

      expect(Pdfs::AdminUsageSnapshotEmailWorker).to have_received(:perform_async).exactly(PdfSubscription.monthly.count).times
    end
  end
end
