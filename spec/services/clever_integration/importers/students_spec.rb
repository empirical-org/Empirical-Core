require 'rails_helper'

describe 'CleverIntegration::Importers::Students' do

  let!(:classroom) {
    create(:classroom, name: 'class1', code: 'nice-great')
  }

  let!(:classrooms) {
    [classroom]
  }

  let!(:district_token) { '1' }

  let!(:students_response) {
    [
      {id: '1',
       email: 'student@gmail.com',
       name: {
        first: 'john',
        last: 'smith'
       },
       credentials: {
        district_username: 'student_username'
       }
     }
    ]
  }

  let!(:section_requester) {
    response_struct = Struct.new(:students)
    response = response_struct.new(students_response)

    lambda do |clever_id, district_token|
      response
    end
  }


  def subject
    CleverIntegration::Importers::Students.run(classrooms, district_token, section_requester)
    User.find_by(name: 'John Smith', email: 'student@gmail.com', username: 'student_username', clever_id: '1', role: 'student')
  end

  it 'creates a student' do
    expect(subject).to_not be_nil
  end

  it 'associates student to classroom' do
    expect(subject.classrooms).to include(classroom)
  end
end
