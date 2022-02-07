# frozen_string_literal: true

require 'rails_helper'

describe CalculateAndCacheVitallyAccountWorker do
  subject { described_class.new }

  let(:school) { create(:school) }
  let(:user) { create(:teacher, school: school) }

  describe '#perform' do
    it 'call calculate and save data on schools' do
      year = 2017
      data = {}
      new_datum = double(calculate_data: data)
      expect(PreviousYearSchoolDatum).to receive(:new).with(school, year).and_return(new_datum)
      expect(CacheVitallySchoolData).to receive(:set).with(school.id, year, data.to_json)

      subject.perform(school.id, year)
    end
  end
end
