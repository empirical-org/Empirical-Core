# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SyncVitallyWorker, type: :worker do
  let(:worker) { described_class.new }

  describe '#perform' do

    before do
      stub_const('ENV', { 'SYNC_TO_VITALLY' => 'true' })
    end

    it 'make queries for schools and users and enqueue them for further jobs' do
      district = create(:district)
      school = create(:school, district:)
      user = create(:user, role: 'teacher')
      schools_user = create(:schools_users, school:, user:)
      new_school = create(:school, district:)
      schools_user.update(school: new_school)

      expect(SyncVitallyUnlinksWorker).to receive(:perform_async).with(user.id, school.id)
      expect(SyncVitallyAccountsWorker).to receive(:perform_in).with(0.seconds, [new_school.id])
      expect(SyncVitallyUsersWorker).to receive(:perform_in).with(0.seconds, [user.id])
      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(0.seconds, district.id)

      worker.perform
    end


    it 'does not kick off a job to unlink users if the ChangeLog is more than 25 hours long' do
      create(:change_log,
        changed_record_type: 'User',
        changed_record_id: 1,
        changed_attribute: 'school',
        new_value: 1,
        created_at: DateTime.current - 72.hours)

      expect(SyncVitallyUnlinksWorker).not_to receive(:perform_async)
      worker.perform
    end

    it 'does not kick off job for users who are not teachers' do
      user = create(:user, role: 'student')

      expect(SyncVitallyUsersWorker).not_to receive(:perform_in)
      worker.perform
    end

    it 'does not kick off job for schools without teachers' do
      school = create(:school)

      expect(SyncVitallyAccountsWorker).not_to receive(:perform_in)
      worker.perform
    end

    it 'does not kick off job for districts without schools with teachers' do
      district = create(:district)
      school = create(:school, district: district)

      expect(SyncVitallyOrganizationWorker).not_to receive(:perform_in)
      worker.perform
    end

    it 'spaces out organization sync' do
      3.times do
        district = create(:district)
        school = create(:school, district: district)
        user = create(:user, role: 'teacher')
        SchoolsUsers.create(school: school, user: user)
      end

      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(0.seconds, anything).once
      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(1.second, anything).once
      expect(SyncVitallyOrganizationWorker).to receive(:perform_in).with(2.seconds, anything).once

      worker.perform
    end
  end
end
