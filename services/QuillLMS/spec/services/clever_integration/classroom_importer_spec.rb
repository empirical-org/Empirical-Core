# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomImporter do
  let(:name) { 'clever classroom' }
  let(:teacher) { create(:teacher) }

  let(:data) do
    {
      clever_id: clever_id,
      name: name,
      grade: '1',
      teacher_id: teacher.id
    }
  end

  subject { described_class.run(data) }

  context 'classroom exists with clever_id' do
    let(:clever_id) { '123_abc' }
    let(:synced_name) { "original #{name}"}

    let!(:classroom) { create(:classroom, synced_name: synced_name, clever_id: clever_id) }

    it { expect { subject }.to(change { classroom.reload.synced_name }.from(synced_name).to(name)) }
  end

  context 'classroom does not exist with clever_id' do
    let(:clever_id) { 'non_existent_id' }

    it { expect { subject }.to change(Classroom, :count).from(0).to(1) }
    it { expect { subject }.to change(ClassroomsTeacher, :count).from(0).to(1) }
  end
end
