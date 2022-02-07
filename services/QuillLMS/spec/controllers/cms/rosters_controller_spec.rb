# frozen_string_literal: true

require 'rails_helper'

describe Cms::RostersController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }

  describe '#upload_teachers_and_students' do
    let!(:school) { create(:school)}

    it 'should create teachers and students based on the data provided, and it should ignore empty items in payload arrays' do
      teacher_email = "email@test.org"
      student_email = "studentemail@test.org"
      another_student_email = "anotheremail@test.org"
      classroom_name = "Class A"
      post :upload_teachers_and_students, params: {
        school_id: school.id,
        teachers: [
          {
            name: "Test Teacher",
            email: teacher_email,
            password: nil
          },
          {} # Intentionally empty hash to test error handling
        ],
        students: [
          {
            name: "Test Student",
            email: student_email,
            teacher_name: "Test Teacher",
            teacher_email: teacher_email,
            classroom: classroom_name,
            password: "password"
          },
          {
            name: "Another Student",
            email: another_student_email,
            teacher_name: "Test Teacher",
            teacher_email: teacher_email,
            classroom: classroom_name,
            password: nil
          },
          {} # Intentionally empty hash to test error handling
        ]
      }

      teacher = User.find_by(email: teacher_email)
      student = User.find_by(email: student_email)
      another_student = User.find_by(email: another_student_email)
      classroom = Classroom.find_by(name: classroom_name)
      expect(teacher).to be
      expect(student).to be
      expect(another_student).to be
      expect(teacher.email).to eq(teacher_email)
      expect(student.email).to eq(student_email)
      expect(SchoolsUsers.find_by(school: school, user: teacher)).to be
      expect(classroom).to be
      expect(ClassroomsTeacher.find_by(classroom: classroom, user: teacher)).to be
      expect(StudentsClassrooms.find_by(classroom: classroom, student: student)).to be
      expect(StudentsClassrooms.find_by(classroom: classroom, student: another_student)).to be
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to be_empty
    end

    it 'should flash error if school is not found' do
      post :upload_teachers_and_students, params: { school_id: 10000000 }
      expect(response.status).to eq 422
      expect(JSON.parse(response.body)["errors"]).to eq("School not found. Check that the ID is correct and try again.")
    end

    it 'should flash error if teacher or student already exists' do
      student = create(:student)
      teacher = create(:teacher)

      post :upload_teachers_and_students, params: {
        school_id: school.id,
        teachers: [],
        students: [
          {
            name: "Test Student",
            email: student.email,
            teacher_name: teacher.name,
            teacher_email: teacher.email,
            classroom: "classroom name",
            password: "password"
          }
        ]
      }

      expect(response.status).to eq 422
      expect(JSON.parse(response.body)["errors"]).to eq("Student with email #{student.email} already exists.")

      post :upload_teachers_and_students, params: {
        school_id: school.id,
        teachers: [
          name: teacher.name,
          email: teacher.email,
          password: nil
        ],
        students: []
      }

      expect(response.status).to eq 422
      expect(JSON.parse(response.body)["errors"]).to eq("Teacher with email #{teacher.email} already exists.")
    end

    it 'should flash error if no password or last name is provided' do
      post :upload_teachers_and_students, params: {
        school_id: school.id,
        teachers: [
          name: "Firstname",
          email: "email@email.org",
          password: nil
        ],
        students: []
      }

      expect(response.status).to eq 422
      expect(JSON.parse(response.body)["errors"]).to eq("Please provide a last name or password for teacher Firstname, otherwise this account will have no password.")
    end

    it 'should flash error if a student is attached to a nonexistent teacher' do
      post :upload_teachers_and_students, params: {
        school_id: school.id,
        teachers: [],
        students: [
          {
            name: "Test Student",
            email: "test@test.org",
            teacher_name: "Fake Name",
            teacher_email: "noemail@none.org",
            classroom: "classroom name",
            password: "password"
          }
        ]
      }

      expect(response.status).to eq 422
      expect(JSON.parse(response.body)["errors"]).to eq("Teacher with email noemail@none.org does not exist.")
    end
  end
end
