# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  describe UpdateTeacherImportedClassroomsWorker do
    subject { described_class.new.perform(user_id) }

    context 'nil user_id' do
      let(:user_id) { nil }

      it do
        expect(ErrorNotifier).to receive(:report).with(described_class::UserNotFoundError, user_id: user_id)
        expect(TeacherClassroomsCacheHydrator).to_not receive(:run)
        expect(TeacherImportedClassroomsUpdater).to_not receive(:run)
        subject
      end
    end

    context 'user does not exist' do
      let(:user_id) { 0 }

      it do
        expect(ErrorNotifier).to receive(:report).with(described_class::UserNotFoundError, user_id: user_id)
        expect(TeacherClassroomsCacheHydrator).to_not receive(:run)
        expect(TeacherImportedClassroomsUpdater).to_not receive(:run)
        subject
      end
    end

    context 'user exists' do
      let(:user) { create(:teacher, :signed_up_with_google) }
      let(:user_id) { user.id }

      before { create(:google_auth_credential, user: user) }

      it do
        expect(ErrorNotifier).not_to receive(:report)
        expect(TeacherClassroomsCacheHydrator).to receive(:run).with(user)
        expect(TeacherImportedClassroomsUpdater).to receive(:run).with(user)
        subject
      end
    end
  end
end
