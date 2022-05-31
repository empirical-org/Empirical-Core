# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "make queries for schools and users and enqueue them for further jobs" do
      ENV['SYNC_TO_VITALLY'] = 'true'
      district = create(:district)
      school = create(:school)
      user = create(:user)
      expect(worker).to receive(:schools_to_sync).and_return([school])
      expect(worker).to receive(:users_to_sync).and_return([user])
      expect(SyncVitallyAccountsWorker).to receive(:perform_async).with([school.id])
      expect(SyncVitallyUsersWorker).to receive(:perform_async).with([user.id])
      expect(SyncVitallyOrganizationsWorker).to receive(:perform_async).with([district.id])
      worker.perform
    end

    it "#will kick off the PopulateAnnualVitallyWorker if it is July 1" do
      allow(Date).to receive(:current).and_return Date.new(2020,7,1)
      ENV['SYNC_TO_VITALLY'] = 'true'
      school = create(:school)
      user = create(:user)
      expect(PopulateAnnualVitallyWorker).to receive(:perform_async)
      worker.perform
    end

    it "#will NOT kick off the PopulateAnnualVitallyWorker if it is NOT July 1" do
      allow(Date).to receive(:current).and_return Date.new(2020,7,2)
      ENV['SYNC_TO_VITALLY'] = 'true'
      school = create(:school)
      user = create(:user)
      expect(PopulateAnnualVitallyWorker).not_to receive(:perform_async)
      worker.perform
    end
  end
end
