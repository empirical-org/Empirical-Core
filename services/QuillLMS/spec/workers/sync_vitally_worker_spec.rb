# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do

    before do
      stub_const('ENV', {'SYNC_TO_VITALLY' => 'true'})
    end

    it "make queries for schools and users and enqueue them for further jobs" do
      district = create(:district)
      school = create(:school, district: district)
      user = create(:user, role: 'teacher')
      SchoolsUsers.create(school: school, user: user)

      expect(SyncVitallyAccountsWorker).to receive(:perform_async).with([school.id])
      expect(SyncVitallyUsersWorker).to receive(:perform_async).with([user.id])
      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(0.minutes, district.id)
      worker.perform
    end

    it 'does not kick off job for users who are not teachers' do
      user = create(:user, role: 'student')

      expect(SyncVitallyUsersWorker).not_to receive(:perform_async).with([user.id])
      worker.perform
    end

    it 'does not kick off job for schools without teachers' do
      school = create(:school)

      expect(SyncVitallyAccountsWorker).not_to receive(:perform_async).with([school.id])
      worker.perform
    end

    it 'does not kick off job for districts without schools with teachers' do
      district = create(:district)
      school = create(:school, district: district)

      expect(SyncVitallyOrganizationWorker).not_to receive(:perform_async).with([district.id])
      worker.perform
    end

    it 'spaces out organization sync in batches of ORGANIZATION_RATE_LIMIT_PER_MINUTE' do
      stub_const('SyncVitallyWorker::ORGANIZATION_RATE_LIMIT_PER_MINUTE', 1)

      (SyncVitallyWorker::ORGANIZATION_RATE_LIMIT_PER_MINUTE * 3).times do
        district = create(:district)
        school = create(:school, district: district)
        user = create(:user, role: 'teacher')
        SchoolsUsers.create(school: school, user: user)
      end

      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(0.minutes, anything).exactly(SyncVitallyWorker::ORGANIZATION_RATE_LIMIT_PER_MINUTE).times
      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(2.minutes, anything).exactly(SyncVitallyWorker::ORGANIZATION_RATE_LIMIT_PER_MINUTE).times
      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(4.minutes, anything).exactly(SyncVitallyWorker::ORGANIZATION_RATE_LIMIT_PER_MINUTE).times

      worker.perform
    end
  end
end
