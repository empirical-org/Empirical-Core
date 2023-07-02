# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherImportedClassroomsUpdater do
  subject { described_class.run(user) }

  let(:imported_classroom) { create(:classroom, :from_google) }
  let(:user) { imported_classroom.owner }

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

  it 'updates only previously imported classrooms that have google_classroom_id' do
    expect(GoogleIntegration::TeacherClassroomsCache).to receive(:read).with(user.id).and_return(data)

    expect(GoogleIntegration::ImportClassroomStudentsWorker)
      .to receive(:perform_async)
      .with(user.id, [imported_classroom.id])

    subject

    expect(Classroom.count).to eq 1
    expect(imported_classroom.reload.synced_name).to eq updated_name
  end
end
