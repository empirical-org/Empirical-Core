# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClassroomStudentsImporter do
  let(:classroom) { create(:classroom, :from_canvas) }
  let(:canvas_classroom) { classroom.canvas_classroom }
  let(:canvas_instance_id) { canvas_classroom.canvas_instance_id }
  let(:classroom_external_id) { canvas_classroom.external_id }
  let(:classroom_students_data) { CanvasIntegration::ClassroomStudentsData.new(classroom, client) }
  let(:client) { double(:canvas_client) }

  before { allow(client).to receive(:classroom_students).with(classroom_external_id).and_return(students_data) }

  subject { described_class.run(classroom_students_data) }

  context 'classroom_students_data is nil' do
    let(:students_data) { nil }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.not_to change(StudentsClassrooms, :count) }
    it { expect { subject }.not_to change(CanvasClassroomUser, :count) }
  end

  context 'classroom_students_data is empty' do
    let(:students_data) { [] }

    it { expect { subject }.not_to change(User.student, :count) }
    it { expect { subject }.not_to change(StudentsClassrooms, :count) }
    it { expect { subject }.not_to change(CanvasClassroomUser, :count) }
  end

  context 'classroom_students_data has two students' do
    let(:students_data) { [student1_attrs, student2_attrs] }

    let(:student1_data) { create(:canvas_student_payload).deep_symbolize_keys }
    let(:student1_attrs) { CanvasIntegration::StudentDataAdapter.run(canvas_instance_id, student1_data) }

    let(:student2_data) { create(:canvas_student_payload).deep_symbolize_keys }
    let(:student2_attrs) { CanvasIntegration::StudentDataAdapter.run(canvas_instance_id, student2_data) }

    it { expect { subject }.to change(User.student, :count).from(0).to(2) }
    it { expect { subject }.to change(StudentsClassrooms, :count).from(0).to(2) }
    it { expect { subject }.to change(CanvasClassroomUser, :count).from(0).to(2) }
  end
end
