require 'rails_helper'

describe SyncVitallyWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "make queries for schools and users and enqueue them for further jobs" do
      school = create(:school)
      user = create(:user)
      expect(worker).to receive(:schools_to_sync).and_return([school])
      expect(worker).to receive(:users_to_sync).and_return([user])
      expect(SyncVitallyAccountsWorker).to receive(:perform_async).with([school.id])
      expect(SyncVitallyUsersWorker).to receive(:perform_async).with([user.id])
      worker.perform
    end
  end
end
