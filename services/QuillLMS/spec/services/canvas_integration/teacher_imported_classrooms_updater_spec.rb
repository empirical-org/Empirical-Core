# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::TeacherImportedClassroomsUpdater do
  subject { described_class.run(user) }

  let(:imported_classroom) { create(:classroom, :from_canvas) }
  let(:canvas_classroom) { imported_classroom.canvas_classroom }
  let(:user) { imported_classroom.owner }

  let(:canvas_instance_id) { canvas_classroom.canvas_instance_id }
  let(:new_external_id) { Faker::Number.number }
  let(:new_classroom_external_id) { CanvasClassroom.build_classroom_external_id(canvas_instance_id, new_external_id) }

  let(:updated_name) { "new_#{imported_classroom.name}"}

  let(:data) do
    {
      classrooms: [
        { classroom_external_id: canvas_classroom.classroom_external_id, name: updated_name },
        { classroom_external_id: new_classroom_external_id }
      ]
    }.to_json
  end

  it 'updates only previously imported classrooms that have canvas_classroom_id' do
    expect(CanvasIntegration::TeacherClassroomsCache)
      .to receive(:read)
      .with(user.id)
      .and_return(data)

    expect(CanvasIntegration::ImportTeacherClassroomsStudentsWorker)
      .to receive(:perform_async)
      .with(user.id, [imported_classroom.id])

    subject

    expect(Classroom.count).to eq 1
    expect(imported_classroom.reload.synced_name).to eq updated_name
  end
end
