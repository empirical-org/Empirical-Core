# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::UpdateTeacherImportedClassroomsWorker do
  let(:worker) { described_class.new }

  subject { worker.perform(user_id) }

  context 'nil user_id' do
    let(:user_id) { nil }

    it { should_not_run_service_objects }
  end

  context 'user does not exist' do
    let(:user_id) { 0 }

    it { should_not_run_service_objects }
  end

  context 'user exists' do
    let!(:user) { create(:teacher, :signed_up_with_google) }
    let(:user_id) { user.id }

    context 'with no auth_credential' do
      it { should_not_run_service_objects }
    end

    context 'with auth_credential' do
      before { create(:google_auth_credential, user: user) }

      it { should_run_service_objects }
    end
  end

  def should_not_run_service_objects
    expect(GoogleIntegration::TeacherClassroomsRetriever).to_not receive(:run)
    expect(GoogleIntegration::TeacherImportedClassroomsUpdater).to_not receive(:run)
    subject
  end

  def should_run_service_objects
    expect(GoogleIntegration::TeacherClassroomsRetriever).to receive(:run).with(user_id)
    expect(GoogleIntegration::TeacherImportedClassroomsUpdater).to receive(:run).with(user_id)
    subject
  end
end
