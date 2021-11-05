require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomImporter do
  let(:name) { 'clever classroom' }

  let(:data) do
    {
      clever_id: clever_id,
      name: name,
      grade: '1'
    }
  end

  subject { described_class.new(data) }

  context 'classroom exists with clever_id' do
    let(:clever_id) { '123_abc' }
    let(:synced_name) { 'original ' + name}

    let!(:classroom) { create(:classroom, synced_name: synced_name, clever_id: clever_id) }

    it 'runs classroom updater' do
      expect { subject.run }.to(change { classroom.reload.synced_name }.from(synced_name).to(name))
    end
  end

  context 'classroom does not exist with clever_id' do
    let(:clever_id) { 'non_existent_id' }

    it 'creates a new classroom' do
      expect { subject.run }.to change(Classroom, :count).from(0).to(1)
    end
  end
end
