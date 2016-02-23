require 'rails_helper'

describe 'CleverIntegration::Importers::Helpers::Classrooms' do

  let!(:teacher) {
    FactoryGirl.create(:district, name: 'district1', clever_id: '1', token: '1')
  }

  let!(:district_token) { '1' }

  let!(:sections_response) {
    [

    ]
  }

  let!(:teacher_requester) {

    Response = Struct.new(:sections)
    response = Response.new(sections_response)

    lambda do |clever_id, district_token|
      response
    end
  }


  def subject
    CleverIntegration::Importers::Helpers::Classrooms.run(teacher, district_token, teacher_requester)

  end

  it 'creates a classroom' do
    expect(subject).to_not be_nil
  end

  it 'associates classroom to teacher' do
    expect(subject.districts.first).to eq(district)
  end
end