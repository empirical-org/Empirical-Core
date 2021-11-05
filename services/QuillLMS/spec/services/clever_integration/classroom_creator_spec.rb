require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomCreator do
  let(:data) do
    {
      clever_id: clever_id,
      name: name,
      grade: grade
    }
  end

  subject { described_class.new(data) }

  let(:classroom) { subject.run }

  context 'valid params' do
    let(:clever_id) { '123_456' }
    let(:name) { 'clever classroom' }
    let(:grade) { '1' }

    it 'creates a new classroom object with synced_name attr initially set to name' do
      expect(classroom.clever_id).to eq clever_id
      expect(classroom.grade).to eq grade
      expect(classroom.name).to eq name
      expect(classroom.synced_name).to eq name
    end
  end

  context 'invalid params' do
    let(:clever_id) { '123_456'}
    let(:name) { '' }
    let(:grade) { '1' }

    it 'raises an error with an invalid data param' do
      expect { classroom }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
