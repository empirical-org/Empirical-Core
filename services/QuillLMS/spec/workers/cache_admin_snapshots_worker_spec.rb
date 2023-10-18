# frozen_string_literal: true

require 'rails_helper'

describe CacheAdminSnapshotsWorker, type: :worker do
  subject { worker.perform(admin_id) }

  let(:worker) { described_class.new }
  let(:admin) { create(:admin) }
  let(:admin_id) { admin.id }
  let(:schools_admin) { create(:schools_admins, user: admin) }
  let(:school) { schools_admin.school }
  let(:school_ids) { [school.id] }

  let(:previous_timeframe_start) { previous_timeframe_end - 1.day }
  let(:previous_timeframe_end) { current_timeframe_start - 1.day }
  let(:current_timeframe_start) { current_timeframe_end - 1.day }
  let(:current_timeframe_end) { DateTime.current }

  let(:query_name) { 'query' }
  let(:payload) { ['payload'] }
  let(:previous_payload) { ['previous_payload'] }

  before do
    allow(Snapshots::Timeframes).to receive(:calculate_timeframes).and_return([previous_timeframe_start, previous_timeframe_end, current_timeframe_start, current_timeframe_end])

    stub_const("Snapshots::CacheSnapshotCountWorker::QUERIES", { query_name => nil })
    stub_const("Snapshots::CacheSnapshotTopXWorker::QUERIES", { query_name => nil })
  end

  context 'enqueueing cache workers' do
    it do
      expect(worker).to receive(:generate_worker_payload)
        .with(query_name, previous_timeframe_start, previous_timeframe_end, school_ids)
        .once
        .ordered
        .and_return(previous_payload)
      expect(worker).to receive(:generate_worker_payload)
        .with(query_name, current_timeframe_start, current_timeframe_end, school_ids)
        .twice
        .ordered
        .and_return(payload)
      expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*previous_payload)
      expect(Snapshots::CacheSnapshotCountWorker).to receive(:perform_async).with(*payload)
      expect(Snapshots::CacheSnapshotTopXWorker).to receive(:perform_async).with(*payload)

      subject
    end
  end

  context 'non-existent admin_id' do
    let(:admin_id) { admin.id + 1 }

    it do
      expect(Snapshots::Timeframes).not_to receive(:calculate_timeframes)
      subject
    end
  end
end
