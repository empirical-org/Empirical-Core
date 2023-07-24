# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ImportTeacherClassroomsStudentsWorker do
  subject { described_class.new }

  let(:teacher) { create(:teacher, :with_canvas_account) }
  let(:selected_classroom_ids) { [123, 456] }
  let(:importer_class) { CanvasIntegration::TeacherClassroomsStudentsImporter }

  it 'should report an error with nil teacher_id' do
    expect(ErrorNotifier).to receive(:report).with(ActiveRecord::RecordNotFound)
    subject.perform(nil)
  end

  it 'should report an error with not bad teacher_id' do
    expect(ErrorNotifier).to receive(:report).with(ActiveRecord::RecordNotFound)
    subject.perform(0)
  end

  it 'should not run importer when teacher is unauthorized' do
    expect(importer_class).to_not receive(:run)
    subject.perform(teacher.id)
  end

  context 'teacher is canvas authorized' do
    before { create(:canvas_auth_credential, user: teacher) }

    it 'should run importing with valid teacher id and no selected_classroom_ids' do
      expect(importer_class).to receive(:run).with(teacher, nil)
      subject.perform(teacher.id)
    end

    it 'should run importing with valid teacher id and selected_classroom_ids' do
      expect(importer_class).to receive(:run).with(teacher, selected_classroom_ids)
      subject.perform(teacher.id, selected_classroom_ids)
    end
  end
end
