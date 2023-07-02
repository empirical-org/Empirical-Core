# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::HydrateTeacherClassroomsCacheWorker do
  subject { described_class.new.perform(user_id) }

  context 'nil user_id' do
    let(:user_id) { nil }

    it { should_not_run_hydrator }
  end

  context 'user does not exist' do
    let(:user_id) { 0 }

    it { should_not_run_hydrator }
  end

  context 'user exists' do
    let(:user_id) { create(:student).id }

    it { should_not_run_hydrator }
  end

  context 'user is not google authorized' do
    let(:user_id) { create(:teacher, :signed_up_with_google).id }

    it { should_not_run_hydrator }
  end

  context 'user is google authorized' do
    let(:user) { create(:google_auth_credential).user }
    let(:user_id) { user.id }

    it { should_run_hydrator }
  end

  def should_run_hydrator
    expect(GoogleIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(user)
    subject
  end

  def should_not_run_hydrator
    expect(GoogleIntegration::TeacherClassroomsCacheHydrator).not_to receive(:run)
    subject
  end
end
