# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClassroomStudentsData do
  subject { described_class.new(classroom, client) }

  let(:classroom) { create(:classroom, :from_canvas) }
  let(:client) { double('client') }
  let(:canvas_classroom) { classroom.canvas_classroom }
  let(:classroom_external_id) { canvas_classroom.external_id }
  let(:canvas_instance_id) { canvas_classroom.canvas_instance_id }

  let(:student1_data) { create(:canvas_student_payload).deep_symbolize_keys }
  let(:student1_attrs) { CanvasIntegration::StudentDataAdapter.run(canvas_instance_id, student1_data) }

  let(:student2_data) { create(:canvas_student_payload).deep_symbolize_keys }
  let(:student2_attrs) { CanvasIntegration::StudentDataAdapter.run(canvas_instance_id, student2_data) }

  let(:students_data) { [student1_attrs, student2_attrs] }
  let(:classroom_students_data) { students_data.map { |attrs| attrs.merge(classroom: classroom) } }

  before { allow(client).to receive(:classroom_students).with(classroom_external_id).and_return(students_data) }

  it { expect(subject.to_a).to match_array classroom_students_data }
  it { expect(subject.classroom_external_id).to eq classroom.classroom_external_id }
end


