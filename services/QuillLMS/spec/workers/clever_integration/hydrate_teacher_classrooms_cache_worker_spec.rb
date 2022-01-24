# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::HydrateTeacherClassroomsCacheWorker do
  subject { described_class.new.perform(teacher_id) }

  let(:hydrator_class) { CleverIntegration::TeacherClassroomsCacheHydrator }

  context 'nil user_id' do
    let(:teacher_id) { nil }

    it { should_not_hydrate_cache }
  end

  context 'user does not exist' do
    let(:teacher_id) { 0 }

    it { should_not_hydrate_cache }
  end

  context 'user exists' do
    context 'that does not have clever_id' do
      let(:teacher_id) { create(:teacher).id }

      it { should_not_hydrate_cache }
    end

    context 'that has clever_id' do
      let(:teacher_id) { create(:teacher, :signed_up_with_clever).id }

      it { should_hydrate_cache }
    end
  end

  def should_not_hydrate_cache
    expect(hydrator_class).to_not receive(:run)
    subject
  end

  def should_hydrate_cache
    expect(hydrator_class).to receive(:run).with(teacher_id)
    subject
  end
end
