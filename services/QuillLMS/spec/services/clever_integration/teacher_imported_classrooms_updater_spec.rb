# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherImportedClassroomsUpdater do
  let!(:imported_classroom) { create(:classroom, :from_clever).reload }

  let(:teacher_id) { imported_classroom.owner.id }
  let(:new_classroom_clever_id) { 'abcdefg' }
  let(:updated_name) { 'new_' + imported_classroom.name}

  let(:data) do
    {
      classrooms: [
        { clever_id: imported_classroom.clever_id, name: updated_name },
        { clever_id: new_classroom_clever_id, name: 'new classroom' }
      ]
    }.to_json
  end

  subject { described_class.run(teacher_id) }

  # To be utilized with frontend UI PR
  # it 'updates only previously imported classrooms that have clever_id' do
  #   expect(CleverIntegration::TeacherClassroomsCache).to receive(:get).with(teacher_id).and_return(data)
  #   expect(CleverIntegration::ImportClassroomStudentsWorker).to receive(:perform_async).with(teacher_id, [imported_classroom.id])
  #   subject

  #   expect(Classroom.count).to eq 1
  #   expect(imported_classroom.reload.synced_name).to eq updated_name
  # end

  it 'imports a new classroom and updates and existing one' do
    expect(CleverIntegration::TeacherClassroomsCache).to receive(:get).with(teacher_id).and_return(data)
    expect(CleverIntegration::ImportClassroomStudentsWorker).to receive(:perform_async)
    subject

    expect(Classroom.count).to eq 2
    expect(imported_classroom.reload.synced_name).to eq updated_name
  end
end
