# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::HydrateTeacherClassroomsCacheWorker do
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

  context 'user is not clever authorized' do
    let(:user_id) { create(:teacher, :signed_up_with_clever).id }

    it { should_not_run_hydrator }
  end

  context 'user is clever authorized' do
    let(:user) { create(:clever_library_auth_credential).user }
    let(:user_id) { user.id }

    it { should_run_hydrator }
  end

  def should_run_hydrator
    expect(CleverIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(user)
    subject
  end

  def should_not_run_hydrator
    expect(CleverIntegration::TeacherClassroomsCacheHydrator).not_to receive(:run)
    subject
  end
end
