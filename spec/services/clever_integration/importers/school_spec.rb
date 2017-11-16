require 'rails_helper'

describe 'CleverIntegration::Importers::School' do

  let!(:teacher) {
    create(:teacher, :signed_up_with_clever)
  }

  let!(:district_token) { '1' }

  let!(:school_response) {
    {name: 'school1'}
  }

  let!(:teacher_requester) {

    Response = Struct.new(:school)
    response = Response.new(school_response)

    lambda do |clever_id, district_token|
      response
    end
  }


  def subject
    CleverIntegration::Importers::School.run(teacher, district_token, teacher_requester)
    School.first
  end

  it 'creates a school' do
    expect(subject).to_not be_nil
  end

  it 'associates school to teacher' do
    expect(subject).to eq(teacher.reload.school)
  end
end
