require 'rails_helper'

RSpec.describe GoogleIntegration::Classrooms::Creator do
  let(:teacher) { create(:teacher) }

  let(:data) do
    {
      google_classroom_id: google_classroom_id,
      name: name,
      teacher_id: teacher.id
    }
  end

  subject { described_class.new(data) }

  let(:classroom) { subject.run }

  let(:google_classroom_id) { 123456 }

  context 'name present' do
    let(:name) { 'google classroom name'}

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(classroom.google_classroom_id).to eq google_classroom_id
      expect(classroom.name).to eq name
      expect(classroom.synced_name).to eq name
    end
  end

  context 'blank name' do
    let(:name) { nil }

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(classroom.google_classroom_id).to eq google_classroom_id
      expect(classroom.name).to eq "Classroom #{google_classroom_id}"
      expect(classroom.synced_name).to eq nil
    end
  end
end
