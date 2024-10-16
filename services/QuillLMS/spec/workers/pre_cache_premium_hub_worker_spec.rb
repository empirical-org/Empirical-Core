# frozen_string_literal: true

require 'rails_helper'

describe PreCachePremiumHubsWorker, type: :worker do
  let(:worker) { described_class.new }
  let!(:old_admin) { create(:user, last_sign_in: 1.year.ago) }
  let!(:current_admin1) { create(:user, last_sign_in: Time.current) }
  let!(:current_admin2) { create(:user, last_sign_in: Time.current) }
  let!(:not_admin) { create(:user, last_sign_in: Time.current) }
  let(:mock_users_worker) { double(:mock_users_worker, perform_async: nil) }
  let(:mock_snapshot_cache_worker) { double(:mock_snapshot_cache_worker, perform_async: nil) }

  before do
    create(:schools_admins, user: old_admin)
    create(:schools_admins, user: current_admin1)
    create(:schools_admins, user: current_admin2)

    allow(FindAdminUsersWorker).to receive(:set).with(queue: SidekiqQueue::DEFAULT).and_return(mock_users_worker)
    allow(CacheAdminSnapshotsWorker).to receive(:set).with(queue: SidekiqQueue::DEFAULT).and_return(mock_snapshot_cache_worker)
  end

  it 'enqueues FindAdminUsersWorker for all active admins' do
    expect(mock_users_worker).to receive(:perform_async).with(current_admin1.id).once
    expect(mock_users_worker).to receive(:perform_async).with(current_admin2.id).once
    worker.perform
  end

  it 'does not enqueue FindAdminUsersWorker for non-admins' do
    expect(mock_users_worker).not_to receive(:perform_async).with(not_admin.id)
    worker.perform
  end

  it 'does not enqueue FindAdminUsersWorker for non-active admins' do
    expect(mock_users_worker).not_to receive(:perform_async).with(old_admin.id)
    worker.perform
  end

  context 'duplicate admins' do
    let!(:new_admin_old_user) { create(:schools_admins, user: current_admin1) }

    it 'should not queue duplicates' do
      expect(mock_users_worker).to receive(:perform_async).with(current_admin1.id).once
      expect(mock_users_worker).to receive(:perform_async).with(current_admin2.id).once
      worker.perform
    end
  end
end
