require 'rails_helper'

describe GoogleStudentImporterWorker do
  describe '#perform' do
    let(:teacher) { create(:teacher, :signed_up_with_google) }
    let(:selected_classroom_ids) { [123, 456] }

    it 'should raise an error with a invalid teacher_id' do
      expect(GoogleIntegration::TeacherClassroomsStudentsImporter).not_to receive(:new)

      subject.perform(nil)
    end

    it 'should run importing with valid teacher id and no selected_classroom_ids' do
      expect(GoogleIntegration::TeacherClassroomsStudentsImporter).to receive(:new).with(teacher, nil)

      subject.perform(teacher.id)
    end

    it 'should run importing with valid teacher id and no selected_classroom_ids' do
      expect(GoogleIntegration::TeacherClassroomsStudentsImporter).to receive(:new).with(teacher, selected_classroom_ids)

      GoogleStudentImporterWorker.new.perform(teacher.id, nil, selected_classroom_ids)
    end
  end
end
