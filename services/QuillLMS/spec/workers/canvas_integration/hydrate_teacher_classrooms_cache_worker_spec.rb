# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::HydrateTeacherClassroomsCacheWorker do
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

  context 'user is not canvas authorized' do
    let(:user_id) { create(:teacher, :with_canvas_account).id }

    it { should_not_run_hydrator }
  end

  context 'user is canvas authorized' do
    let(:user) { create(:canvas_auth_credential).user }
    let(:user_id) { user.id }

    it { should_run_hydrator }
  end

  def should_run_hydrator
    expect(CanvasIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(user)
    subject
  end

  def should_not_run_hydrator
    expect(CanvasIntegration::TeacherClassroomsCacheHydrator).not_to receive(:run)
    subject
  end
end
