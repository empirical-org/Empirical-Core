require 'rails_helper'

RSpec.describe CleverIntegration::Classrooms::Importer do
  let(:data) do
    {
      clever_id: clever_id,
      name: 'clever classroom',
      grade: '1'
    }
  end

  subject { described_class.new(data) }

  context 'classroom exists with clever_id' do
    let(:clever_id) { '123_abc' }

    before { create(:classroom, clever_id: clever_id) }

    it 'runs classroom updater' do
      expect { subject.run }.to_not change(Classroom, :count)
    end
  end

  context 'classroom does not exist with clever_id' do
    let(:clever_id) { 'non_existent_id' }

    it 'creates a new classroom' do
      expect { subject.run }.to change(Classroom, :count).from(0).to(1)
    end
  end
end
