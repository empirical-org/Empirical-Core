# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyPastYearAccountsWorker do
  subject { described_class.new }

  let(:school) { create(:school) }
  let(:user) { create(:teacher, school: school) }

  describe '#perform' do
    it 'call calculate and save data on schools' do
      year = 2017

      expect(CalculateAndCacheVitallyAccountWorker).to receive(:perform_async).with(school.id, year)
      subject.perform([school.id], year)
    end
  end
end
