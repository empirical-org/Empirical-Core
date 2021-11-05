require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomUpdater do
  let(:clever_id) { '123_456' }

  let!(:classroom) do
    create(:classroom,
      clever_id: clever_id,
      name: name,
      synced_name: synced_name
    )
  end

  let(:data) do
    {
      clever_id: clever_id,
      name: data_name,
      grade: '100'
    }
  end

  subject { described_class.new(data) }

  let(:updated_classroom) { subject.run }

  before { expect(updated_classroom.id).to eq classroom.id }

  context 'no custom classroom name' do
    let(:name) { 'clever classroom' }
    let(:synced_name) { name }

    context 'name on Clever has not changed' do
      let(:data_name) { synced_name }

      it 'no attributes are changed' do
        expect(updated_classroom.name).to eq classroom.name
        expect(updated_classroom.synced_name).to eq classroom.synced_name
      end

      it 'updates grade' do
        expect(updated_classroom.grade).to_not eq classroom.grade
      end
    end

    context 'name on Clever changed' do
      let(:data_name) { 'Renamed on Quill' + synced_name }

      it 'updates name and synced name with data_name' do
        expect(updated_classroom.name).to eq data_name
        expect(updated_classroom.synced_name).to eq data_name
      end
    end
  end

  context 'custom classroom name' do
    let(:name) { 'Renamed on Quill' + synced_name }
    let(:synced_name) { 'Clever Classroom' }

    context 'name on Clever has not changed' do
      let(:data_name) { synced_name }

      it 'no attributes are changed' do
        expect(updated_classroom.name).to eq classroom.name
        expect(updated_classroom.synced_name).to eq classroom.synced_name
      end
    end

    context 'name on Clever has changed' do
      let(:data_name) { 'renamed on Clever ' + synced_name }

      it 'updates synced name with data_name' do
        expect(updated_classroom.name).to eq classroom.name
        expect(updated_classroom.synced_name).to eq data_name
      end
    end
  end

end
