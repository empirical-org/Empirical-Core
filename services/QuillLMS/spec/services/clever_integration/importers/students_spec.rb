require 'rails_helper'

describe 'CleverIntegration::Importers::Students' do

  let!(:classroom) {
    create(:classroom, name: 'class1', code: 'nice-great', clever_id: 'blah')
  }

  let!(:classrooms) {
    [classroom]
  }

  let!(:district_token) { '1' }

  def subject
    CleverIntegration::Importers::Students.run(classrooms, district_token)
    User.find_by(email: 'fake@example.net')
  end

  before do
    clever_student = Clever::Student.new({
      id: "53ea7d6b2187a9bc1e188be0",
      created: "2014-08-12T20:47:39.084Z",
      email: 'fake@example.net',
      credentials: Clever::Credentials.new({
        district_username: 'username'
      }),
      name: Clever::Name.new({
        first: 'Fake',
        last: 'Student'
      }),
      location:
        {
          address: "350 5th Avenue",
          city: "New York",
          state: "NY",
          zip: 10001
        }
    })

    clever_student_response = Clever::StudentResponse.new({ data: clever_student })
    allow_any_instance_of(Clever::DataApi).to receive(:get_students_for_section).and_return(Clever::StudentsResponse.new({ data: [clever_student_response] }))
  end

  it 'creates a student' do
    expect(subject).to_not be_nil
  end

  it 'associates student to classroom' do
    expect(subject.classrooms).to include(classroom)
  end
end
