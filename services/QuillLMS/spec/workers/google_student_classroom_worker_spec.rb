# frozen_string_literal: true

require 'rails_helper'

describe GoogleStudentClassroomWorker do
  describe '#perform' do
    let(:student) { create(:student, :signed_up_with_google) }
    let(:importer_class) { GoogleIntegration::Classroom::Main }

    subject { described_class.new }

    context 'no auth_credential' do
      it 'should raise an error with an invalid student_id' do
        expect(importer_class).not_to receive(:join_existing_google_classrooms)
        subject.perform(nil)
      end
    end

    context 'with an auth credential' do
      before { create(:google_auth_credential, user: student) }

      it 'should run importing with valid student id and no selected_classroom_ids' do
        expect(importer_class).to receive(:join_existing_google_classrooms).with(student)
        subject.perform(student.id)
      end
    end
  end
end
