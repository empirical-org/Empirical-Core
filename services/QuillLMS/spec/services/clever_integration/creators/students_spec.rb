require 'rails_helper'

describe 'CleverIntegration::Creators::Students' do

  let!(:existing_student) { create(:student, email: 'student@gmail.com', clever_id: nil) }
  let!(:existing_student2) { create(:student, username: 'some-username', email: nil, clever_id: nil) }

  let!(:clever_student_1) {
    {
      clever_id: '1',
      email: 'student@gmail.com',
      name: 'John Smith',
      username: 'username'
    }
  }

  let!(:clever_student_2) {
    {
      clever_id: '2',
      email: 'student2@gmail.com',
      name: 'Jane Smith',
      username: 'username2'
    }
  }

  let!(:clever_student_3) {
    {
      clever_id: '3',
      email: nil,
      name: 'Janet Smith',
      username: 'username3'
    }
  }

  it 'will create a new student if none currently exists' do
    CleverIntegration::Creators::Students.run([clever_student_2])
    student = User.find_by(clever_id: '2')
    expect(student).to be
  end

  it 'will update an existing student if one is found with the same non-nil email' do
    CleverIntegration::Creators::Students.run([clever_student_1])
    student = User.find_by(clever_id: '1')
    expect(student).to be
  end

  it 'will create a brand new existing student if the email is nil' do
    CleverIntegration::Creators::Students.run([clever_student_1])
    student = User.find_by(clever_id: '3')
    expect(student.id).not_to be(existing_student2.id)
  end
end
