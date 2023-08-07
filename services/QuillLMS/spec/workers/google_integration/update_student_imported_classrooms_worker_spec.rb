# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  describe UpdateStudentImportedClassroomsWorker do
    subject { described_class.new.perform(user_id) }

    context 'user does not exist' do
      let(:user_id) { nil }

      it do
        expect(StudentImportedClassroomsUpdater).to_not receive(:run)
        subject
      end
    end

    context 'student exists with auth credential' do
      let(:user_id) { create(:student, :signed_up_with_google).id }

      before { create(:google_auth_credential, user_id: user_id) }

      it do
        expect(StudentImportedClassroomsUpdater).to receive(:run)
        subject
      end
    end
  end
end
