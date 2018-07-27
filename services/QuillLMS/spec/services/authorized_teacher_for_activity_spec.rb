require 'rails_helper'

describe AuthorizedTeacherForActivity do

  it 'returns true if the classroom owner is the same as given user' do
    user = create(:user, role: 'teacher')
    classroom = create(:classroom)
    classroom_unit = create(:classroom_unit, classroom: classroom)
    activity_session = create(:activity_session, classroom_unit: classroom_unit)
    create(:classrooms_teachers, role: 'owner', user: user, classroom: classroom)

    result = AuthorizedTeacherForActivity.new(user, activity_session).call

    expect(subject.authorize_teacher).to eq true
  end
end
