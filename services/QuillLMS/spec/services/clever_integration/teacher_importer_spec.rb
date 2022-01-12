# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherImporter do
  let!(:teacher) { create(:teacher, :signed_up_with_clever) }

  subject { described_class.run(data) }

  context 'teacher exists' do
    let(:data) { { clever_id: teacher.clever_id } }

    it 'calls the TeacherUpdater' do
      expect(CleverIntegration::TeacherUpdater).to receive(:run).with(teacher, data)
      subject
    end
  end

  context 'teacher does not exist' do
    let(:data) { { clever_id: 'abcdef123' } }

    it 'calls the TeacherCreator' do
      expect(CleverIntegration::TeacherCreator).to receive(:run).with(data)
      subject
    end
  end
end
