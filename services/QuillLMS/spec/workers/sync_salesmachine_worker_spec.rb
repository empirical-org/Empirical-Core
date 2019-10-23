require 'rails_helper'

describe SyncSalesmachineWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "should rebuild the Redis cache and enqueue Salesmachine sync workers" do
      expect(worker).to receive(:clear_redis_cache)
      expect(worker).to receive(:build_redis_cache)
      expect(SyncSalesAccountsWorker).to receive(:perform_async).with(SyncSalesmachineWorker::ACCOUNTS_KEY)
      expect(SyncSalesContactsWorker).to receive(:perform_async).with(SyncSalesmachineWorker::CONTACTS_KEY)
      expect(SyncSalesStagesWorker).to receive(:perform_async).with(SyncSalesmachineWorker::SALES_STAGE_KEY)
      worker.perform
    end
  end

  describe "#clear_redis_cache" do
    it "should delete all relevant Redis keys" do
      expect($redis).to receive(:del).with(SyncSalesmachineWorker::ACCOUNTS_KEY)
      expect($redis).to receive(:del).with(SyncSalesmachineWorker::CONTACTS_KEY)
      expect($redis).to receive(:del).with(SyncSalesmachineWorker::SALES_STAGE_KEY)
      worker.clear_redis_cache
    end
  end

  describe "#build_redis_cache" do
    let!(:teacher) { create(:teacher_with_school) }

    it "should push relevant ids into Redis caches" do
      expect($redis).to receive(:lpush).with(SyncSalesmachineWorker::ACCOUNTS_KEY, teacher.schools_users.school.id)
      expect($redis).to receive(:lpush).with(SyncSalesmachineWorker::CONTACTS_KEY, teacher.id)
      expect($redis).to receive(:lpush).with(SyncSalesmachineWorker::SALES_STAGE_KEY, teacher.id)
      worker.build_redis_cache
    end
  end
end
