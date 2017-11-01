require 'rails_helper'

describe 'CleverIntegration::Importers::Classrooms' do

  let!(:teacher) {
    create(:user, name: 'John Smith', clever_id: '1')
  }

  let!(:district_token) { '1' }

  let!(:sections_response) {
    [
      {id: '1',
       name: 'section1',
       grade: '2'}
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
    CleverIntegration::Importers::Classrooms.run(teacher, district_token, teacher_requester)
    Classroom.find_by(clever_id: '1', name: 'section1', grade: '2')
  end

  it 'creates a classroom' do
    expect(subject).to_not be_nil
  end

  it 'associates classroom to teacher' do
    expect(subject.teacher).to eq(teacher)
  end
end
