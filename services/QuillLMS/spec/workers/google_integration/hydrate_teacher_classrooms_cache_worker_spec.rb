# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::HydrateTeacherClassroomsCacheWorker do
  subject { described_class.new.perform(user_id) }

  context 'nil user_id' do
    let(:user_id) { nil }

    it do
      expect(GoogleIntegration::TeacherClassroomsCacheHydrator).not_to receive(:run)
      subject
    end
  end

  context 'user does not exist' do
    let(:user_id) { 0 }

    it do
      expect(GoogleIntegration::TeacherClassroomsCacheHydrator).not_to receive(:run)
      subject
    end
  end

  context 'user exists' do
    let(:user) { create(:teacher) }
    let(:user_id) { user.id }

    it do
      expect(GoogleIntegration::TeacherClassroomsCacheHydrator).to receive(:run).with(user)
      subject
    end
  end
end
