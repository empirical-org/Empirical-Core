require 'rails_helper'

describe 'CleverIntegration::SignUp::SubMain' do

  let!(:teacher_response) {
    Response = Struct.new(:sections, :school)
    sections = [
      {
        id: 'section_id_1',
        name: 'section1',
        grade: '2'
      }
    ]
    school = {name: 'school1'}
    x = Response.new(sections, school)
    x
  }

  let!(:section_response) {
    Response = Struct.new(:students)
    students = [
      {
        id: 'student_id_1',
        name: {
          first: 'studentjohn',
          last: 'studentsmith'
        },
        email: 'student@gmail.com',
        credentials: {
          district_username: 'student_username'
        }
      }
    ]
    x = Response.new(students)
    x
  }

  def helper(response)
    lambda do |clever_id, district_token|
      response
    end
  end

  let!(:requesters) {
    {
      teacher_requester: helper(teacher_response),
      section_requester: helper(section_response)
    }
  }

  def subject
    CleverIntegration::SignUp::SubMain.run(auth_hash, requesters)
  end

  context 'district sign up' do
    let!(:auth_hash) {
      {
        info: {
          user_type: 'district',
          id: 'district_id_1',
          name: 'district1'
        },
        credentials: {
          token: 'token1'
        }
      }
    }

    it 'creates the right district' do
      subject
      district = District.find_by(clever_id: 'district_id_1', name: 'district1', token: 'token1')
      expect(district).to be_present
    end
  end

  context 'student signs up' do
    let!(:auth_hash) {
      {
        info: {
          user_type: 'student',
          id: 'student_id_1'
        }
      }
    }

    context 'student pre-exists in our system' do
      let!(:preexisting_student) {
        FactoryGirl.create(:user, clever_id: 'student_id_1')
      }

      it 'finds the pre-existing student (created when the teacher signed up (which must occur beforehand))' do
        student = subject[:data]
        expect(student).to eq(preexisting_student)
      end
    end

    context 'student does not pre-exist in our system' do
      it 'returns failure message' do
        expect(subject).to eq({type: 'user_failure'})
      end
    end
  end

  context 'teacher signs up' do
    let!(:auth_hash) {
      {
        info: {
          user_type: 'teacher',
          id: 'teacher_id_1',
          name: {
            first: 'john',
            last: 'smith'
          },
          email: 'teacher@gmail.com',
          district: 'district_id_1'
        }
      }
    }

    context 'district does not pre-exist in our system' do
      it 'returns failure message' do
        expect(subject).to eq({type: 'user_failure'})
      end
    end

    context 'district pre-exists in our system' do

      let!(:district) {
        FactoryGirl.create(:district, clever_id: 'district_id_1')
      }

      it 'creates the teacher' do
        subject
        u = User.find_by(email: 'teacher@gmail.com', clever_id: 'teacher_id_1', name: 'John Smith')
        puts "users : #{User.all.to_json}"
        expect(u).to be_present
      end

      it 'associates the teacher to the district' do
        subject
        u = User.find_by(email: 'teacher@gmail.com')
        expect(u.districts.first).to eq(district)
      end

      it "creates teacher's classrooms" do
        subject
        c = Classroom.find_by(name: 'section1', clever_id: 'section_id_1')
        expect(c).to be_present
      end

      it 'associates classrooms to teacher' do
        subject
        c = Classroom.find_by(name: 'section1', clever_id: 'section_id_1')
        t = User.find_by(email: 'teacher@gmail.com')
        expect(c.teacher).to eq(t)
      end

      it 'creates students for teachers classrooms' do
        subject
        u = User.find_by(clever_id: 'student_id_1',
                         name: 'Studentjohn Studentsmith',
                         email: 'student@gmail.com',
                         username: 'student_username')
        expect(u).to be_present
      end

      it 'associates students to teachers classrooms' do
        subject
        u = User.find_by(clever_id: 'student_id_1')
        c = Classroom.find_by(name: 'section1')
        expect(u.classroom).to eq(c)
      end
    end
  end
end