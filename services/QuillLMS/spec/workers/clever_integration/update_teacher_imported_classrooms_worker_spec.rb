# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::UpdateTeacherImportedClassroomsWorker do
  subject { described_class.new.perform(user_id) }

  context 'nil user_id' do
    let(:user_id) { nil }

    it { should_not_run_service_objects }
  end

  context 'user does not exist' do
    let(:user_id) { 0 }

    it { should_not_run_service_objects }
  end

  context 'user exists' do
    let(:user) { create(:teacher, :signed_up_with_clever) }
    let(:user_id) { user.id }

    context 'with no auth_credential' do
      it { should_not_run_service_objects }
    end

    context 'with auth_credential' do
      before { create(:clever_library_auth_credential, user: user) }

      it { should_run_service_objects }
    end
  end

  def should_not_run_service_objects
    expect(CleverIntegration::TeacherClassroomsCacheHydrator).to_not receive(:run)
    expect(CleverIntegration::TeacherImportedClassroomsUpdater).to_not receive(:run)
    subject
  end

  def should_run_service_objects
    expect(CleverIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(user)
    expect(CleverIntegration::TeacherImportedClassroomsUpdater).to receive(:run).with(user)
    subject
  end
end
