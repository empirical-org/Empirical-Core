# frozen_string_literal: true

require 'rails_helper'

describe 'CleverIntegration::SignUp::Main' do
  let!(:district) { create(:district, clever_id: 'district_id_1', token: 'token1') }
  let!(:school) { create(:school, nces_id: 'fake_nces_id') }

  before do
    school_admin = Clever::SchoolAdmin.new({
      id: "53ea7d6b2187a9bc1e188be0",
      created: "2014-08-12T20:47:39.084Z",
      email: 'schooladmin@gmail.com',
      credentials: Clever::Credentials.new({
        district_username: 'username'
      }),
      name: Clever::Name.new({
        first: 'School',
        last: 'Admin'
      }),
      location:
        {
          address: "350 5th Avenue",
          city: "New York",
          state: "NY",
          zip: 10001
        }
    })

    school_admin_response = Clever::SchoolAdminResponse.new({ data: school_admin })
    allow_any_instance_of(Clever::DataApi).to receive(:get_school_admin).and_return(school_admin_response)

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

    clever_school_response = Clever::SchoolResponse.new({ data: clever_school })
    allow_any_instance_of(Clever::DataApi).to receive(:get_schools_for_school_admin).and_return(Clever::SchoolsResponse.new({ data: [clever_school_response]}))
    allow(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(district)
  end

  def auth_hash
    {
      info: {
        user_type: 'school_admin',
        id: 'id',
        district: 'district_id_1'
      }
    }
  end

  def subject
    CleverIntegration::SignUp::Main.run(auth_hash)
  end

  def user
    User.find_by_email('schooladmin@gmail.com')
  end

  describe 'when the user is a school admin' do

    it 'creates a user' do
      subject
      expect(user).to be_present
    end

    it 'associates user to district' do
      subject
      expect(user.districts.first).to eq(district)
    end

    it 'associates school to user if school exists' do
      subject
      expect(user.schools_admins.first.school).to eq(school)
    end

    it 'does not associate school to user if school does not exist' do
      school.update(nces_id: 'other_nces_id')
      subject
      expect(user.schools_admins).to eq([])
    end
  end
end
