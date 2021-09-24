require 'rails_helper'

describe CleverIntegration::Importers::Students do
  let!(:classroom) { create(:classroom, name: 'class1', code: 'nice-great', clever_id: 'blah') }
  let!(:classrooms) { [classroom] }
  let!(:district_token) { '1' }

  let(:clever_student_id) { '53ea7d6b2187a9bc1e188be0' }
  let(:clever_student_email) { 'fake@example.net' }
  let(:clever_student_credentials) { Clever::Credentials.new(district_username: 'username') }
  let(:clever_student_name) { Clever::Name.new(first: 'Fake', last: 'Student') }

  let(:clever_student) do
    Clever::Student.new(
      id: clever_student_id,
      created: "2014-08-12T20:47:39.084Z",
      email: clever_student_email,
      credentials: clever_student_credentials,
      name: clever_student_name,
      location: {
        address: "350 5th Avenue",
        city: "New York",
        state: "NY",
        zip: 10001
      }
    )
  end

  let(:clever_student_response) { Clever::StudentResponse.new(data: clever_student) }
  let(:clever_students_response) { Clever::StudentsResponse.new(data: [clever_student_response]) }

  let(:student) { User.find_by(email: clever_student_email) }

  before { allow_any_instance_of(Clever::DataApi).to receive(:get_students_for_section).and_return(clever_students_response) }

  def import_students
    CleverIntegration::Importers::Students.run(classrooms, district_token)
  end

  it 'creates a student' do
    import_students
    expect(student).to_not be_nil
  end

  it 'associates student to classroom' do
    import_students
    expect(student.classrooms).to include(classroom)
  end

  it 'creates CleverClassroom user records' do
    expect { import_students }.to change(CleverClassroomUser, :count).from(0).to(1)
  end

  context 'email and clever_id pairing are split among two users in database' do
    let!(:user) { create(:user, email: clever_student_email, clever_id: nil) }
    let!(:clever_user) { create(:user, email: nil, clever_id: clever_student_id) }

    it { expect { import_students }.not_to change(CleverClassroomUser, :count) }
  end
end
