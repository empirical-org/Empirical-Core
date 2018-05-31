require 'rails_helper'

describe 'CleverIntegration::Sync::SubMain' do

  include_context 'clever'

  let!(:district) {
    create(:district, clever_id: 'district_id_1', token: 'token1')
  }

  let!(:district_response) {
    response = Struct.new(:teachers)
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
    response.new(teachers)
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

  it 'associates school to teacher if school exists' do
    build(:school, nces_id: 'fake_nces_id')
    subject
    expect(teacher.school).to eq(school)
  end

  it 'does not associate school to teacher if school does not exists' do
    build(:school, nces_id: 'fake_nces_id2')
    subject
    expect(teacher.school).to eq(nil)
  end

  it 'creates classrooms' do
    subject
    expect(classroom).to be_present
  end

  it 'associates classrooms to teacher' do
    subject
    expect(classroom.owner).to eq(teacher)
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
