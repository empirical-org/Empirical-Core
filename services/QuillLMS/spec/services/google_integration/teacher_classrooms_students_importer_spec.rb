# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherClassroomsStudentsImporter do
  let(:classrooms) { create_list(:classroom, 2, :from_google, :with_no_teacher) }
  let(:classroom1) { classrooms[0] }
  let(:classroom2) { classrooms[1] }
  let(:classroom_external_id1) { classroom1.classroom_external_id }
  let(:classroom_external_id2) { classroom2.classroom_external_id }

  let(:teacher) { create(:teacher, :signed_up_with_google) }

  let!(:classrooms_teacher1) { create(:classrooms_teacher, user: teacher, classroom: classroom1) }
  let!(:classrooms_teacher2) { create(:classrooms_teacher, user: teacher, classroom: classroom2) }

  subject { described_class.run(teacher, selected_classroom_ids) }

  let(:raw_students_data1) { [create(:google_classroom_student_payload)] }
  let(:raw_students_data2) { [create(:google_classroom_student_payload)] }

  let(:initialized_teacher_client) { double('initialized_teacher_client') }
  let(:created_teacher_client) { double('created_teacher_client') }
  let(:classroom_students_client) { double('classroom_students_client') }
  let(:teacher_client) { double('teacher_client') }

  before do
    allow(GoogleIntegration::Client).to receive(:new).and_return(initialized_teacher_client)
    allow(initialized_teacher_client).to receive(:create).and_return(created_teacher_client)

    allow(GoogleIntegration::Classroom::Requesters::Students)
      .to receive(:generate)
      .with(created_teacher_client)
      .and_return(classroom_students_client)

    allow(classroom_students_client).to receive(:call).with(classroom_external_id1).and_return(raw_students_data1)
    allow(classroom_students_client).to receive(:call).with(classroom_external_id2).and_return(raw_students_data2)
  end

  context 'selected_classroom_ids nil' do
    let(:selected_classroom_ids) { nil }

    it 'imports all google classrooms for a teacher' do
      expect(GoogleClassroomUser.count).to eq 0
      expect(User.student.count).to eq 0
      subject
      expect(GoogleClassroomUser.count).to eq 2
      expect(GoogleClassroomUser.where(classroom_external_id: classroom_external_id1).count).to eq 1
      expect(GoogleClassroomUser.where(classroom_external_id: classroom_external_id2).count).to eq 1
      expect(User.student.count).to eq 2
    end
  end

  context 'selected_classroom_ids present' do
    let(:selected_classroom_ids) { [classroom2.id] }

    it 'imports only selected google classrooms for a teacher' do
      expect(GoogleClassroomUser.count).to eq 0
      expect(User.student.count).to eq 0
      subject
      expect(GoogleClassroomUser.count).to eq 1
      expect(GoogleClassroomUser.where(classroom_external_id: classroom_external_id1).count).to eq 0
      expect(GoogleClassroomUser.where(classroom_external_id: classroom_external_id2).count).to eq 1
      expect(User.student.count).to eq 1
    end
  end
end
