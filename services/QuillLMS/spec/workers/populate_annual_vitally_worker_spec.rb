# frozen_string_literal: true

require 'rails_helper'

describe PopulateAnnualVitallyWorker do
  subject { described_class.new }

  describe "#perform" do
    it "make queries for schools and users and enqueue them for further jobs" do
      past_year = School.school_year_start(Date.current - 1.year).year
      ENV['SYNC_TO_VITALLY'] = 'true'
      school = create(:school)
      user = create(:user)
      expect(subject).to receive(:schools_to_sync).and_return([school])
      expect(subject).to receive(:users_to_sync).and_return([user])

      expect(SyncVitallyPastYearUsersWorker).to receive(:perform_async).with([user.id], past_year)
      expect(SyncVitallyPastYearAccountsWorker).to receive(:perform_async).with([school.id], past_year)
      subject.perform
    end
  end
end
