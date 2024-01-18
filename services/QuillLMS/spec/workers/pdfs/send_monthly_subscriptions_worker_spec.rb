# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pdfs::SendMonthlySubscriptionsWorker, type: :worker do
  describe '#perform' do
    let(:monthly_subscription) { create(:pdf_subscription, frequency: PdfSubscription::MONTHLY) }

    before do
      create_list(:pdf_subscription, 2, frequency: PdfSubscription::MONTHLY)
      allow(PdfSubscription).to receive(:monthly).and_return(PdfSubscription.monthly)
      allow(Pdfs::AdminUsageSnapshotEmailJob).to receive(:perform_async)
    end

    it 'enqueues a job for each monthly subscription' do
      subject.perform

      expect(Pdfs::AdminUsageSnapshotEmailJob).to have_received(:perform_async).exactly(PdfSubscription.monthly.count).times
    end
  end
end
