# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::TeacherClassroomsStudentsImporter do
  subject { described_class.run(teacher, classroom_ids) }

  let(:canvas_classroom) { create(:classroom, :from_canvas) }
  let(:teacher) { canvas_classroom.owner }

  let(:non_canvas_classroom) do
    create(:classrooms_teacher, classroom: create(:classroom, :with_no_teacher), user: teacher).classroom
  end

  let(:classroom_ids) { [canvas_classroom.id, non_canvas_classroom.id] }

  let(:client) { double(:client) }
  let(:classroom_students_data) { double(:classroom_students_data) }

  before do
    allow(CanvasIntegration::ClassroomStudentsData)
    .to receive(:new)
    .with(canvas_classroom, client)
    .and_return(classroom_students_data)
  end

  it 'runs the importer only on canvas classrooms' do
    expect(CanvasIntegration::ClientFetcher).to receive(:run).with(teacher).and_return(client)
    expect(CanvasIntegration::ClassroomStudentsImporter).to receive(:run).with(classroom_students_data)
    subject
  end
end
