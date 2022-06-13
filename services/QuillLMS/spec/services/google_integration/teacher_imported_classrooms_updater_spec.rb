# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherImportedClassroomsUpdater do
  let!(:imported_classroom) { create(:classroom, :from_google) }
  let(:teacher_id) { imported_classroom.owner.id }

  let(:new_google_classroom_id) { 345 }

  let(:updated_name) { "new_#{imported_classroom.name}"}

  let(:data) do
    {
      classrooms: [
        { id: imported_classroom.google_classroom_id, name: updated_name },
        { id: new_google_classroom_id }
      ]
    }.to_json
  end

  subject { described_class.run(teacher_id) }

  it 'updates only previously imported classrooms that have google_classroom_id' do
    expect(GoogleIntegration::TeacherClassroomsCache).to receive(:read).with(teacher_id).and_return(data)

    subject

    expect(Classroom.count).to eq 1
    expect(imported_classroom.reload.synced_name).to eq updated_name
  end
end
