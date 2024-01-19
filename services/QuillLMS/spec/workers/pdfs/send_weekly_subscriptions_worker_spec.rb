# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Pdfs::SendWeeklySubscriptionsWorker, type: :worker do
  describe '#perform' do
    let(:weekly_subscription) { create(:pdf_subscription, frequency: PdfSubscription::WEEKLY) }

    before do
      create_list(:pdf_subscription, 2, frequency: PdfSubscription::WEEKLY)
      allow(PdfSubscription).to receive(:weekly).and_return(PdfSubscription.weekly)
      allow(Pdfs::AdminUsageSnapshotEmailWorker).to receive(:perform_async)
    end

    it 'enqueues a job for each weekly subscription' do
      subject.perform

      expect(Pdfs::AdminUsageSnapshotEmailWorker).to have_received(:perform_async).exactly(PdfSubscription.weekly.count).times
    end
  end
end
