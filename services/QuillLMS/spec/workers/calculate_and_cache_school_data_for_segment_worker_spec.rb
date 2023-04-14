# frozen_string_literal: true

require 'rails_helper'

describe CalculateAndCacheSchoolDataForSegmentWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:school) { create(:school) }

    it 'should call calculate_and_set_cache on the CacheSegmentSchoolData instance' do
      cache = double(calculate_and_set_cache: nil)
      expect(CacheSegmentSchoolData).to receive(:new).with(school).and_return(cache)
      expect(cache).to receive(:calculate_and_set_cache)
      subject.perform(school.id)
    end
  end
end
