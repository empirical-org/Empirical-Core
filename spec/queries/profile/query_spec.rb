require 'rails_helper'

describe 'Profile::Query' do
  let(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }

  let(:activity) { FactoryGirl.create(:activity) }
  let(:unit1) { FactoryGirl.create(:unit) }
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity,
                                                  classroom: classroom,
                                                  activity: activity,
                                                  unit: unit1) }

  let(:activity2) { FactoryGirl.create(:activity) }
  let!(:unit2) { FactoryGirl.create(:unit) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity,
                                                  classroom: classroom,
                                                  activity: activity2,
                                                  unit: unit2) }

  def subject
    Profile::Query.new.query(student, 20, 0, classroom.id)
  end

  # before do
  #   as1.update_attributes(percentage: 1, state: 'finished')
  # end

  it 'returns all activity sessions' do
    sessions = subject
    expect(sessions.count).to eq(2)
  end


end
