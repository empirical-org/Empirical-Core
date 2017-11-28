require 'rails_helper'

describe 'CleverIntegration::SignUp::SubMain' do

  include_context 'clever'


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
        create(:user, clever_id: 'student_id_1')
      }

      it 'finds the pre-existing student (created when the teacher signed up (which must occur beforehand))' do
        student = subject[:data]
        expect(student).to eq(preexisting_student)
      end
    end

    context 'student does not pre-exist in our system' do
      it 'returns failure message' do
        expect(subject).to eq({:type=>"user_failure", :data=>"No Student Present"})
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
            first: 'teacherjohn',
            last: 'teachersmith'
          },
          email: 'teacher@gmail.com',
          district: 'district_id_1'
        }
      }
    }

    context 'district does not pre-exist in our system' do
      it 'returns failure message' do
        expect(subject).to eq({type: 'user_failure', data: "District has not authorized this school yet"})
      end
    end

    context 'district pre-exists in our system' do

      let!(:district) {
        create(:district, clever_id: 'district_id_1')
      }

      it 'creates the teacher' do
        subject
        expect(teacher).to be_present
      end

      it 'associates the teacher to the district' do
        subject
        expect(teacher.districts.first).to eq(district)
      end

      it 'creates the teachers school' do
        subject
        expect(school).to be_present
      end

      it 'associates the school to the teacher' do
        subject
        expect(teacher.school).to eq(school)
      end

      it "creates teacher's classrooms" do
        subject
        expect(classroom).to be_present
      end

      it 'associates classrooms to teacher' do
        subject
        expect(classroom.teacher).to eq(teacher)
      end

      # it 'creates students for teachers classrooms' do
      #   subject
      #   expect(student).to be_present
      # end
      #
      # it 'associates students to teachers classrooms' do
      #   subject
      #   expect(student.classrooms).to include(classroom)
      # end

    end
  end
end
