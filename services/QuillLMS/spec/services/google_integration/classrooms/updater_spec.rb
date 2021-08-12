require 'rails_helper'

RSpec.describe GoogleIntegration::Classrooms::Updater do
  let(:google_classroom_id) { 123456 }
  let(:teacher_id) { create(:teacher).id }

  let!(:classroom) do
    create(:classroom,
      google_classroom_id: google_classroom_id,
      name: name,
      synced_name: synced_name,
      teacher_id: teacher_id
    )
  end

  let(:data) do
    {
      google_classroom_id: google_classroom_id,
      name: data_name,
      grade: '100',
      teacher_id: teacher_id
    }
  end

  subject { described_class.new(data) }

  let(:updated_classroom) { subject.run }

  before { expect(updated_classroom.id).to eq classroom.id }

  context 'no custom classroom name' do
    let(:name) { 'google_classroom classroom' }
    let(:synced_name) { name }

    context 'name on google_classroom has not changed' do
      let(:data_name) { synced_name }

      it 'no attributes are changed' do
        expect(updated_classroom.name).to eq classroom.name
        expect(updated_classroom.synced_name).to eq classroom.synced_name
      end

      it 'updates grade' do
        expect(updated_classroom.grade).to_not eq classroom.grade
      end
    end

    context 'name on google_classroom changed' do
      let(:data_name) { 'Renamed on Quill' + synced_name }

      it 'updates name and synced name with data_name' do
        expect(updated_classroom.name).to eq data_name
        expect(updated_classroom.synced_name).to eq data_name
      end
    end
  end

  context 'custom classroom name' do
    let(:name) { 'Renamed on Quill' + synced_name }
    let(:synced_name) { 'google_classroom Classroom' }

    context 'name on google_classroom has not changed' do
      let(:data_name) { synced_name }

      it 'no attributes are changed' do
        expect(updated_classroom.name).to eq classroom.name
        expect(updated_classroom.synced_name).to eq classroom.synced_name
      end
    end

    context 'name on google_classroom has changed' do
      let(:data_name) { 'renamed on google_classroom ' + synced_name }

      it 'updates synced name with data_name' do
        expect(updated_classroom.name).to eq classroom.name
        expect(updated_classroom.synced_name).to eq data_name
      end
    end
  end
end
