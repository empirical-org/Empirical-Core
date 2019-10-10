require 'rails_helper'

describe 'CleverIntegration::Creators::Student' do

  let!(:existing_student) { create(:student, email: 'student@gmail.com', clever_id: nil) }

  let!(:clever_student_1) {
      Clever::Student.new({id: '1',
       email: 'student@gmail.com',
       name: Clever::Name.new({first: 'john', last: 'smith'}),
       credentials: Clever::Credentials.new({district_username: 'username'})})
  }

  let!(:clever_student_2) {
      Clever::Student.new({id: '2',
       email: 'student2@gmail.com',
       name: Clever::Name.new({first: 'joe', last: 'smith'}),
       credentials: Clever::Credentials.new({district_username: 'username2'})})
  }

  def subject
    CleverIntegration::Parsers::Student.run(clever_student)
  end

  it 'will create a new student if none currently exists' do
    CleverIntegration::Parsers::Student.run(clever_student_2)
    student = User.find_by(clever_id: '2')
    expect(student).to be
  end

  it 'will update an existing student if one is found with the same email' do
    CleverIntegration::Parsers::Student.run(clever_student)
    student = User.find_by(clever_id: '1')
    expect(student).to be
  end
end
