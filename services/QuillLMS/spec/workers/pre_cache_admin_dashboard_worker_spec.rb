# frozen_string_literal: true

require 'rails_helper'

describe PreCacheAdminDashboardsWorker, type: :worker do
  let(:worker) { described_class.new }
  let!(:old_admin) { create(:user, last_sign_in: 1.year.ago) }
  let!(:current_admin1) { create(:user, last_sign_in: Time.current) }
  let!(:current_admin2) { create(:user, last_sign_in: Time.current) }
  let!(:not_admin) { create(:user, last_sign_in: Time.current) }
  let(:mock_users_worker) {double(:mock_users_worker, perform_async: nil)}
  let(:mock_activity_worker) {double(:mock_activity_worker, perform_async: nil)}
  let(:mock_standards_worker) {double(:mock_standards_worker, perform_async: nil)}
  let(:mock_concept_worker) {double(:mock_concept_worker, perform_async: nil)}

  before do
    create(:schools_admins, user: old_admin)
    create(:schools_admins, user: current_admin1)
    create(:schools_admins, user: current_admin2)

    allow(FindAdminUsersWorker).to receive(:set).with(queue: SidekiqQueue::DEFAULT).and_return(mock_users_worker)
    allow(FindDistrictActivityScoresWorker).to receive(:set).with(queue: SidekiqQueue::DEFAULT).and_return(mock_activity_worker)
    allow(FindDistrictStandardsReportsWorker).to receive(:set).with(queue: SidekiqQueue::DEFAULT).and_return(mock_standards_worker)
    allow(FindDistrictConceptReportsWorker).to receive(:set).with(queue: SidekiqQueue::DEFAULT).and_return(mock_concept_worker)
  end

  it 'enqueues FindAdminUsersWorker for all active admins' do
    expect(mock_users_worker).to receive(:perform_async).with(current_admin1.id).once
    expect(mock_users_worker).to receive(:perform_async).with(current_admin2.id).once
    worker.perform
  end

  it 'enqueues FindDistrictActivityScoresWorker for admins' do
    expect(mock_activity_worker).to receive(:perform_async).with(current_admin1.id).once
    expect(mock_activity_worker).to receive(:perform_async).with(current_admin2.id).once
    worker.perform
  end

  it 'enqueues FindDistrictStandardsReportWorker for admins' do
    expect(mock_standards_worker).to receive(:perform_async).with(current_admin1.id).once
    expect(mock_standards_worker).to receive(:perform_async).with(current_admin2.id).once
    worker.perform
  end

  it 'enqueues FindDistrictConceptReportsWorker for admins' do
    expect(mock_concept_worker).to receive(:perform_async).with(current_admin1.id).once
    expect(mock_concept_worker).to receive(:perform_async).with(current_admin2.id).once
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

  context "duplicate admins" do
    let!(:new_admin_old_user) { create(:schools_admins, user: current_admin1) }

    it "should not queue duplicates" do
      expect(mock_worker).to receive(:perform_async).with(current_admin1.id).once
      expect(mock_worker).to receive(:perform_async).with(current_admin2.id).once
      worker.perform
    end
  end
end
