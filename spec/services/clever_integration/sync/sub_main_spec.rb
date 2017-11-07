require 'rails_helper'

describe 'CleverIntegration::Sync::SubMain' do

  include_context 'clever'

  let!(:district) {
    create(:district, clever_id: 'district_id_1', token: 'token1')
  }

  let!(:district_response) {
    Response = Struct.new(:teachers)
    teachers = [
      {
        id: 'teacher_id_1',
        name: {
          first: 'teacherjohn',
          last: 'teachersmith'
        },
        email: 'teacher@gmail.com',
        district: 'district_id_1'
      }

    ]
    x = Response.new(teachers)
    x
  }

  let!(:requesters2) {
    requesters.merge(
      {district_requester: helper(district_response)}
    )
  }

  def subject
    CleverIntegration::Sync::SubMain.run(requesters2)
  end



  it 'creates teachers' do
    subject
    expect(teacher).to be_present
  end

  it 'associates teachers to district' do
    subject
    expect(teacher.districts.first).to eq(district)
  end

  it 'creates teachers school' do
    subject
    expect(school).to be_present
  end

  it 'associates school to teacher' do
    subject
    expect(teacher.school).to eq(school)
  end

  it 'creates classrooms' do
    subject
    expect(classroom).to be_present
  end

  it 'associates classrooms to teacher' do
    subject
    expect(classroom.teacher).to eq(teacher)
  end

  it 'creates students' do
    subject
    expect(student).to be_present
  end

  it 'associates student to classroom' do
    subject
    expect(student.classrooms).to include(classroom)
  end
end
