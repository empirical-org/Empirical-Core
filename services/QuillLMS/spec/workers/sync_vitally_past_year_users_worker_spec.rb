require 'rails_helper'

describe SyncVitallyPastYearUsersWorker do
  let(:subject) { described_class.new }
  let(:user) { create(:teacher, role: 'teacher') }

  describe '#perform' do
    it 'call calculate and save data on schools' do
      year = 2017

      expect(CalculateAndCacheVitallyUserWorker).to receive(:perform_async).with(user.id, year)
      subject.perform([user.id], year)
    end
  end
end
