require 'rails_helper'

describe SyncVitallyPastYearUsersWorker do
  let(:subject) { described_class.new }
  let(:user) { create(:teacher, role: 'teacher') }

  describe '#perform' do
    it 'call calculate and save data on schools' do
      year = 2017
      new_datum = PreviousYearTeacherDatum.new(user, year)
      teacher_datum = double(PreviousYearTeacherDatum, new: new_datum)
      expect(PreviousYearTeacherDatum).to receive(:new).and_return(new_datum)
      subject.perform([user.id], year)
    end
  end
end
