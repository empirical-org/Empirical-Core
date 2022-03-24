# frozen_string_literal: true

require 'rails_helper'

describe PreCacheAdminDashboardsWorker, type: :worker do
  let(:worker) { described_class.new }
  let!(:old_admin) { create(:user, last_sign_in: Time.now - 1.year) }
  let!(:current_admin1) { create(:user, last_sign_in: Time.now) }
  let!(:current_admin2) { create(:user, last_sign_in: Time.now) }
  let!(:not_admin) { create(:user, last_sign_in: Time.now) }

  before do
    create(:schools_admins, user: old_admin)
    create(:schools_admins, user: current_admin1)
    create(:schools_admins, user: current_admin2)
  end

  it 'enqueues FindAdminUsersWorker for all active admins' do
    expect(FindAdminUsersWorker).to receive(:perform_async).with(current_admin1.id).once
    expect(FindAdminUsersWorker).to receive(:perform_async).with(current_admin2.id).once
    worker.perform
  end

  it 'does not enqueue FindAdminUsersWorker for non-admins' do
    expect(FindAdminUsersWorker).not_to receive(:perform_async).with(not_admin.id)
    worker.perform
  end

  it 'does not enqueue FindAdminUsersWorker for non-active admins' do
    expect(FindAdminUsersWorker).not_to receive(:perform_async).with(old_admin.id)
    worker.perform
  end
end
