# frozen_string_literal: true

require 'rails_helper'

describe SendSegmentIdentifyCallForAllAdminsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:schools_admins) { create_list(:schools_admins, 5) }
    let!(:random_other_school) { create(:school)}

    it 'should kick off a worker for the school of every school admin' do
      schools_admins.each do |sa|
        expect(CalculateAndCacheSchoolDataForSegmentWorker).to receive(:perform_async).with(sa.school_id)
      end
      subject.perform
    end

    it 'should not kick off a worker for any other schools' do
      expect(CalculateAndCacheSchoolDataForSegmentWorker).not_to receive(:perform_async).with(random_other_school.id)
    end
  end
end
