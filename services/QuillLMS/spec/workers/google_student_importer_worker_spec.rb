# frozen_string_literal: true

require 'rails_helper'

describe GoogleStudentImporterWorker do
  describe '#perform' do
    let(:teacher) { create(:teacher, :signed_up_with_google) }
    let(:selected_classroom_ids) { [123, 456] }
    let(:importer_class) { GoogleIntegration::TeacherClassroomsStudentsImporter }

    subject { described_class.new }

    context 'no auth_credential' do
      it 'should raise an error with an invalid teacher_id' do
        expect(importer_class).not_to receive(:new)
        subject.perform(nil)
      end
    end

    context 'with an auth credential' do
      before { create(:google_auth_credential, user: teacher) }

      it 'should run importing with valid teacher id and no selected_classroom_ids' do
        expect(importer_class).to receive(:new).with(teacher, nil)
        subject.perform(teacher.id)
      end

      it 'should run importing with valid teacher id and selected_classroom_ids' do
        expect(importer_class).to receive(:new).with(teacher, selected_classroom_ids)
        subject.perform(teacher.id, nil, selected_classroom_ids)
      end
    end
  end
end
