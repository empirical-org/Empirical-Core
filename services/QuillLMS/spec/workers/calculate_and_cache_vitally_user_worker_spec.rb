# frozen_string_literal: true

require 'rails_helper'

describe CalculateAndCacheVitallyUserWorker do
  subject { described_class.new }

  let(:school) { create(:school) }
  let(:user) { create(:teacher, school: school) }

  describe '#perform' do
    it 'call calculate and save data on schools' do
      year = 2017
      data = {}
      new_datum = double(calculate_data: data)
      expect(PreviousYearTeacherDatum).to receive(:new).with(user, year).and_return(new_datum)
      expect(CacheVitallyTeacherData).to receive(:set).with(user.id, year, data.to_json)

      subject.perform(user.id, year)
    end
  end
end
