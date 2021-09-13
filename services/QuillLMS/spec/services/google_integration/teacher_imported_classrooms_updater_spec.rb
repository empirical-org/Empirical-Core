require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherImportedClassroomsUpdater do
  let(:user_id) { create(:teacher).id }

  let(:google_classroom_id_1) { 123 }
  let(:google_classroom_id_2) { 345 }

  let!(:imported_classroom) { create(:classroom, google_classroom_id: google_classroom_id_1, teacher_id: user_id) }
  let(:name) { 'new_' + imported_classroom.name}

  let(:data) do
    {
      classrooms: [
        { id: google_classroom_id_1, name: name },
        { id: google_classroom_id_2 }
      ]
    }.to_json
  end

  let(:subject) { described_class.new(user_id) }

  it 'updates only previously imported classrooms that have google_classroom_id' do
    expect(GoogleIntegration::TeacherClassroomsCache)
      .to receive(:get)
      .with(user_id)
      .and_return(data)

    subject.run

    expect(Classroom.count).to eq 1
    expect(imported_classroom.reload.synced_name).to eq name
  end
end
