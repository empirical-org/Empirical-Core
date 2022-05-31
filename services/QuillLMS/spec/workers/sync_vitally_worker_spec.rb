# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "make queries for schools and users and enqueue them for further jobs" do
      ENV['SYNC_TO_VITALLY'] = 'true'
      district = create(:district)
      school = create(:school, district: district)
      user = create(:user, role: 'teacher')
      SchoolsUsers.create(school: school, user: user)

      expect(SyncVitallyAccountsWorker).to receive(:perform_async).with([school.id])
      expect(SyncVitallyUsersWorker).to receive(:perform_async).with([user.id])
      expect(SyncVitallyOrganizationWorker).to receive(:perform_async).with(district.id)
      worker.perform
    end

    it 'does not kick off job for users who are not teachers' do
      ENV['SYNC_TO_VITALLY'] = 'true'
      user = create(:user, role: 'student')

      expect(SyncVitallyUsersWorker).not_to receive(:perform_async).with([user.id])
      worker.perform
    end

    it 'does not kick off job for schools without teachers' do
      ENV['SYNC_TO_VITALLY'] = 'true'
      school = create(:school)

      expect(SyncVitallyAccountsWorker).not_to receive(:perform_async).with([school.id])
      worker.perform
    end

    it 'does not kick off job for districts without schools with teachers' do
      ENV['SYNC_TO_VITALLY'] = 'true'
      district = create(:district)
      school = create(:school, district: district)

      expect(SyncVitallyOrganizationWorker).not_to receive(:perform_async).with([district.id])
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
