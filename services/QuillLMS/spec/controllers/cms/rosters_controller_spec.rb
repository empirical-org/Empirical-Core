# frozen_string_literal: true

require 'rails_helper'

describe Cms::RostersController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }

  describe '#upload_teachers_and_students' do
    let!(:school) { create(:school)}
    let!(:existing_student) { create(:student) }
    let!(:existing_teacher) { create(:teacher) }

    it 'should create teachers and students based on the data provided, and it should ignore empty items in payload arrays' do
      teacher_email = "Email@test.org"
      student_email = "StudentEmail@test.org"
      another_student_email = "anotheremail@test.org"
      teacher_email_downcased = teacher_email.downcase
      student_email_downcased = student_email.downcase
      another_student_email_downcased = another_student_email.downcase
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

      teacher = User.find_by(email: teacher_email_downcased)
      student = User.find_by(email: student_email_downcased)
      another_student = User.find_by(email: another_student_email_downcased)
      classroom = Classroom.find_by(name: classroom_name)
      expect(teacher).to be
      expect(student).to be
      expect(another_student).to be
      expect(teacher.email).to eq(teacher_email_downcased)
      expect(student.email).to eq(student_email_downcased)
      expect(SchoolsUsers.find_by(school: school, user: teacher)).to be
      expect(classroom).to be
      expect(ClassroomsTeacher.find_by(classroom: classroom, user: teacher)).to be
      expect(StudentsClassrooms.find_by(classroom: classroom, student: student)).to be
      expect(StudentsClassrooms.find_by(classroom: classroom, student: another_student)).to be
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to be_empty

      post :upload_teachers_and_students, params: {
        school_id: school.id,
        students: [
          {
            name: existing_student.name,
            email: existing_student.email,
            teacher_name: teacher.name,
            teacher_email: teacher.email,
            classroom: classroom.name,
            password: "password"
          }
        ]
      }
      expect(StudentsClassrooms.find_by(classroom: classroom, student: existing_student)).to be
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to be_empty
    end

    context 'overwritePasswords param' do
      subject { post :upload_teachers_and_students, params: params }

      let(:overwrite_passwords) { true }
      let(:new_password) { 'new-password' }
      let(:classroom) { 'classroom' }
      let!(:schools_user) { create(:schools_users, school: school, user: existing_teacher) }
      let(:params) do
        {
          school_id: school.id,
          students: [
            {
              name: existing_student.name,
              email: existing_student.email,
              teacher_name: existing_teacher.name,
              teacher_email: existing_teacher.email,
              classroom: classroom,
              password: new_password
            }
          ],
          overwritePasswords: overwrite_passwords
        }
      end

      it do
        subject
        expect(response.status).to eq 200
      end

      it { expect { subject }.to change { existing_student.reload.authenticate(new_password) }.from(false).to(existing_student) }

      context 'overwritePasswords is false' do
        let(:overwrite_passwords) { false }

        it do
          subject
          expect(response.status).to eq 200
        end

      it { expect { subject }.to not_change { existing_student.authenticate(new_password) }}
      end
    end

    it 'should not overwrite passwords for existing student if the parameter overwritePasswords is false' do
      create(:schools_users, school: school, user: existing_teacher)
      new_password = "new-password"
      classroom = "classroom"

      post :upload_teachers_and_students, params: {
        school_id: school.id,
        students: [
          {
            name: existing_student.name,
            email: existing_student.email,
            teacher_name: existing_teacher.name,
            teacher_email: existing_teacher.email,
            classroom: classroom,
            password: new_password
          }
        ],
        overwritePasswords: false
      }
      expect(response.status).to eq 200
      expect(existing_student.authenticate(new_password)).to eq(false)
    end

    it 'should flash error if school is not found' do
      post :upload_teachers_and_students, params: { school_id: 10000000 }
      expect(response.status).to eq 422
      expect(JSON.parse(response.body)["errors"]).to eq("School not found. Check that the ID is correct and try again.")
    end

    it 'should flash error if teacher already exists' do
      teacher = create(:teacher)

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
