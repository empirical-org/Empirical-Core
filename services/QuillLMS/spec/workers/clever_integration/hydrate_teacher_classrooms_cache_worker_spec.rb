# frozen_string_literal: true

require 'rails_helper'

module CleverIntegration
  RSpec.describe HydrateTeacherClassroomsCacheWorker do
    subject { described_class.new.perform(user_id) }

    context 'nil user_id' do
      let(:user_id) { nil }

      it do
        expect(ErrorNotifier).to receive(:report).with(described_class::UserNotFoundError, user_id: user_id)
        expect(TeacherClassroomsCacheHydrator).not_to receive(:run)
        subject
      end
    end

    context 'user does not exist' do
      let(:user_id) { 0 }

      it do
        expect(ErrorNotifier).to receive(:report).with(described_class::UserNotFoundError, user_id: user_id)
        expect(TeacherClassroomsCacheHydrator).not_to receive(:run)
        subject
      end
    end

    context 'user exists' do
      let(:user) { create(:teacher, :signed_up_with_clever) }
      let(:user_id) { user.id }

      it do
        expect(ErrorNotifier).not_to receive(:report)
        expect(TeacherClassroomsCacheHydrator).not_to receive(:run)
        subject
      end

      context 'is clever_authorized' do
        before { create(:clever_library_auth_credential, user: user) }

        it do
          expect(ErrorNotifier).not_to receive(:report)
          expect(TeacherClassroomsCacheHydrator).to receive(:run).with(user)
          subject
        end
      end
    end
  end
end
