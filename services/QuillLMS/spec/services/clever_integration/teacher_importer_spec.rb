# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherImporter do
  let(:clever_id) { 'abcdef123' }
  let(:email) { 'teacher@email.com' }

  let(:data) { { clever_id: clever_id, email: email } }

  subject { described_class.run(data) }

  context 'teacher does not exist' do
    it { should_run_teacher_creator }
  end

  context 'teacher exists' do
    let!(:teacher) { create(:teacher, provider_trait, email: email) }

    context 'teacher is linked with clever' do
      let(:provider_trait) { :signed_up_with_clever }
      let(:clever_id) { teacher.clever_id }

      it { should_run_teacher_updater }
    end

    context 'teacher is linked with google' do
      let(:provider_trait) { :signed_up_with_google }

      it { should_run_teacher_updater }
    end

    context 'teacher is neither linked with clever nor google' do
      let(:provider_trait) { nil }

      it { should_run_teacher_updater }
    end
  end

  def should_run_teacher_creator
    expect(CleverIntegration::TeacherCreator).to receive(:run).with(data)
    subject
  end

  def should_run_teacher_updater
    expect(CleverIntegration::TeacherUpdater).to receive(:run).with(teacher, data)
    subject
  end
end
