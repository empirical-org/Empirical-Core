require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherClassroomsStudentsImporter do
  let(:classrooms) { create_list(:classroom, 2, :from_google, :with_no_teacher) }
  let(:classroom_1) { classrooms[0] }
  let(:classroom_2) { classrooms[1] }
  let(:google_classroom_id_1) { classroom_1.google_classroom_id }
  let(:google_classroom_id_2) { classroom_2.google_classroom_id }

  let(:teacher) { create(:teacher, :signed_up_with_google) }

  let!(:classrooms_teacher_1) { create(:classrooms_teacher, user: teacher, classroom: classroom_1) }
  let!(:classrooms_teacher_2) { create(:classrooms_teacher, user: teacher, classroom: classroom_2) }

  subject { described_class.new(teacher, selected_classroom_ids) }

  let(:raw_students_data_1) { [raw_student_data("17674265", "tim", "student", "tim student", "tim_student@gmail.com")] }
  let(:raw_students_data_2) { [raw_student_data("10622567", "ann", "student", "ann student", "ann_student@gmail.com")] }

  let(:classroom_students_client) { double('classroom_students_client') }

  before { allow(subject).to receive(:classroom_students_client).and_return(classroom_students_client) }

  before { allow(classroom_students_client).to receive(:call).with(google_classroom_id_1).and_return(raw_students_data_1) }
  before { allow(classroom_students_client).to receive(:call).with(google_classroom_id_2).and_return(raw_students_data_2) }

  context 'selected_classroom_ids nil' do
    let(:selected_classroom_ids) { nil }

    it 'imports all google classrooms for a teacher' do
      expect(GoogleClassroomUser.count).to eq 0
      expect(User.student.count).to eq 0
      subject.run
      expect(GoogleClassroomUser.count).to eq 2
      expect(GoogleClassroomUser.where(provider_classroom_id: google_classroom_id_1).count).to eq 1
      expect(GoogleClassroomUser.where(provider_classroom_id: google_classroom_id_2).count).to eq 1
      expect(User.student.count).to eq 2
    end
  end

  context 'selected_classroom_ids present' do
    let(:selected_classroom_ids) { [classroom_2.id] }

    it 'imports only selected google classrooms for a teacher' do
      expect(GoogleClassroomUser.count).to eq 0
      expect(User.student.count).to eq 0
      subject.run
      expect(GoogleClassroomUser.count).to eq 1
      expect(GoogleClassroomUser.where(provider_classroom_id: google_classroom_id_1).count).to eq 0
      expect(GoogleClassroomUser.where(provider_classroom_id: google_classroom_id_2).count).to eq 1
      expect(User.student.count).to eq 1
    end
  end

  def raw_student_data(google_id, first_name, last_name, name, email)
    {
      "profile" => {
        "id" => google_id,
        "name" => {
          "givenName" => first_name,
          "familyName" => last_name,
          "fullName" => name
        },
        "emailAddress" => email
      }
    }
  end
end
