require 'rails_helper'

describe 'CleverIntegration::SignUp::Main' do

  include_context 'clever'

  let!(:district) {
    create(:district, clever_id: 'district_id_1', token: 'token1')
  }

  let!(:school) {
    create(:school, nces_id: 'fake_nces_id')
  }

  # let!(:district_response) {
  #   response = Struct.new(:teachers)
  #   teachers = [
  #     {
  #       id: 'teacher_id_1',
  #       name: {
  #         first: 'teacherjohn',
  #         last: 'teachersmith'
  #       },
  #       email: 'teacher@gmail.com',
  #       district: 'district_id_1'
  #     }
  #
  #   ]
  #   response.new(teachers)
  # }
  #
  # let!(:requesters2) {
  #   requesters.merge(
  #     {district_requester: helper(district_response)}
  #   )
  # }
  before do
    clever_school = Clever::School.new({
      id: "53ea7d6b2187a9bc1e188be0",
      created: "2014-08-12T20:47:39.084Z",
      school_number: "02M800",
      low_grade: "9",
      last_modified: "2014-08-12T20:47:39.086Z",
      name: "City High School",
      phone: "(212) 555-1212",
      sis_id: "02M800",
      location:
        {
          address: "350 5th Avenue",
          city: "New York",
          state: "NY",
          zip: 10001
        },
      district: "53ea7c626e727c2e0d000018",
      state_id: "712345",
      nces_id: "fake_nces_id",
      high_grade: "12"
    })
    allow(Clever::SchoolAdmin).to receive(:retrieve).and_return(Clever::SchoolAdmin.new({
      district: 'district_id_1',
      email: 'schooladmin@gmail.com',
      id: 'id',
      name: 'School Admin',
      schools: ['53ea7d6b2187a9bc1e188be0'],
      staff_id: 'staff_id',
      title: 'title'
    }))

    allow_any_instance_of(Clever::SchoolAdmin).to receive(:schools).and_return([clever_school])
    #
    allow(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(district)
  end

  def auth_hash
    {
      info: {
        user_type: 'school_admin',
        clever_id: 'id',
        email: 'schooladmin@gmail.com',
        name: { first: 'School', last: 'Admin' },
        district: 'district_id_1'
      }
    }
  end

  def subject
    CleverIntegration::SignUp::Main.run(auth_hash)
  end

  def user
    User.find_by_email(school_admin.email)
  end

  it 'creates a user' do
    subject
    expect(user).to be_present
  end

  it 'associates user to district' do
    subject
    expect(user.districts.first).to eq(district)
  end

  it 'associates school to user if school exists' do
    build(:school, nces_id: 'fake_nces_id')
    subject
    expect(user.schools_admins.first.school).to eq(school)
  end

  it 'does not associate school to user if school does not exist' do
    build(:school, nces_id: 'fake_nces_id2')
    subject
    expect(user.schools_admins.first.school).to eq(nil)
  end

#   it 'creates classrooms' do
#     subject
#     expect(classroom).to be_present
#   end
#
#   it 'associates classrooms to teacher' do
#     subject
#     expect(classroom.owner).to eq(teacher)
#   end
#
#   it 'creates students' do
#     subject
#     expect(student).to be_present
#   end
#
#   it 'associates student to classroom' do
#     subject
#     expect(student.classrooms).to include(classroom)
#   end
end
