# frozen_string_literal: true

require 'rails_helper'

describe CalculateAndCacheSchoolDataForSegmentWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:school) { create(:school) }

    it 'should call set_all_fields on the CacheSegmentSchoolData instance' do
      cache = double(set_all_fields: nil)
      expect(CacheSegmentSchoolData).to receive(:new).with(school).and_return(cache)
      expect(cache).to receive(:set_all_fields)
      subject.perform(school.id)
    end
  end
end
