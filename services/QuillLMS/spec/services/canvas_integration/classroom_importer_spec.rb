# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClassroomImporter do
  let(:teacher) { create(:teacher) }
  let(:name) { 'canvas classroom' }
  let(:classroom_external_id) { CanvasClassroom.build_classroom_external_id(canvas_instance_id, external_id) }

  let(:data) do
    {
      classroom_external_id: classroom_external_id,
      name: name,
      teacher_id: teacher.id
    }
  end

  subject { described_class.run(data) }

  context 'classroom exists' do
    let(:synced_name) { "original #{name}"}
    let!(:classroom) { create(:classroom, :from_canvas, synced_name: synced_name) }

    let(:canvas_classroom) { classroom.canvas_classroom }
    let(:canvas_instance_id) { canvas_classroom.canvas_instance_id }
    let(:external_id) { canvas_classroom.external_id }

    it { expect { subject }.to(change { classroom.reload.synced_name }.from(synced_name).to(name)) }
  end

  context 'classroom does not exist' do
    let(:canvas_instance_id) { create(:canvas_instance).id }
    let(:external_id) { Faker::Number.number }

    it { expect { subject }.to change(Classroom, :count).from(0).to(1) }
    it { expect { subject }.to change(ClassroomsTeacher, :count).from(0).to(1) }
  end
end
