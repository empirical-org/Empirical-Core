require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomCreator do
  let(:teacher) { create(:teacher) }
  let(:clever_id) { '123_456'}
  let(:grade) { '1' }

  let(:data) do
    {
      clever_id: clever_id,
      grade: grade,
      name: name,
      teacher_id: teacher.id
    }
  end

  subject { described_class.run(data) }

  context 'valid params' do
    let(:name) { 'clever classroom' }

    it { expect(subject.clever_id).to eq clever_id }
    it { expect(subject.grade).to eq grade }
    it { expect(subject.name).to eq name }
    it { expect(subject.synced_name).to eq name }

    it { expect { subject }.to change(ClassroomsTeacher, :count).from(0).to(1) }
  end

  context 'invalid params' do
    let(:name) { '' }

    it { expect { subject }.to raise_error(ActiveRecord::RecordInvalid) }
  end
end
