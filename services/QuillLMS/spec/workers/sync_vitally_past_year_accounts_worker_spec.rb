require 'rails_helper'

describe SyncVitallyPastYearAccountsWorker do
  let(:subject) { described_class.new }
  let(:school) { create(:school) }
  let(:user) { create(:teacher, school: school) }

  describe '#perform' do
    it 'call calculate and save data on schools' do
      year = 2017
      new_datum = PreviousYearSchoolDatum.new(school, year)
      teacher_datum = double(PreviousYearSchoolDatum, new: new_datum)
      expect(PreviousYearSchoolDatum).to receive(:new).and_return(new_datum)
      subject.perform([school.id], year)
    end
  end
end
