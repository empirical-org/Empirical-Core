# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::Importers::School do
  let!(:teacher) { create(:teacher, :signed_up_with_clever) }
  let!(:district_token) { '1' }
  let!(:district) { create(:district, clever_id: 'district_id_1', token: 'token1') }
  let!(:school) { create(:school, nces_id: 'fake_nces_id') }

  before do
    clever_school = Clever::School.new(
      id: "53ea7d6b2187a9bc1e188be0",
      created: "2014-08-12T20:47:39.084Z",
      school_number: "02M800",
      low_grade: "9",
      last_modified: "2014-08-12T20:47:39.086Z",
      name: "City High School",
      phone: "(212) 555-1212",
      sis_id: "02M800",
      location: {
        address: "350 5th Avenue",
        city: "New York",
        state: "NY",
        zip: 10001
      },
      district: "53ea7c626e727c2e0d000018",
      state_id: "712345",
      nces_id: "fake_nces_id",
      high_grade: "12"
    )

    clever_school_response = Clever::SchoolResponse.new(data: clever_school)
    clever_teacher = Clever::Teacher.new(school: 'school_clever_id')
    allow_any_instance_of(Clever::DataApi).to receive(:get_teacher).and_return(Clever::TeacherResponse.new(data: clever_teacher))
    allow_any_instance_of(Clever::DataApi).to receive(:get_school).and_return(clever_school_response)
  end

  subject { CleverIntegration::Importers::School.run(teacher, district_token) }

  it 'associates school to teacher if the school exists' do
    subject
    expect(teacher.reload.school).to eq(school)
  end

  it 'does not associates school to teacher if the school does not exist' do
    school.update(nces_id: nil)
    subject
    expect(teacher.reload.school).to eq(nil)
  end
end
