# frozen_string_literal: true

require 'rails_helper'

describe OnboardingChecklistAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:create_a_classroom) { create(:create_a_classroom)}
    let!(:add_students) { create(:add_students)}
    let!(:explore_our_library) { create(:explore_our_library)}
    let!(:explore_our_diagnostics) { create(:explore_our_diagnostics)}
    let(:analyzer) { double(:analyzer) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analyzer }
    end

    it 'should track the event if there is a checkbox for that user and each of the onboarding objectives' do
      Checkbox.create(user: user, objective: create_a_classroom)
      Checkbox.create(user: user, objective: add_students)
      Checkbox.create(user: user, objective: explore_our_library)
      Checkbox.create(user: user, objective: explore_our_diagnostics)
      expect(analyzer).to receive(:track_event_from_string).with("TEACHER_COMPLETED_ONBOARDING_CHECKLIST", user.id)
      subject.perform(user.id)
    end

    it 'should not track the event if there are not checkboxes for that user and every onboarding objective' do
      Checkbox.create(user: user, objective: create_a_classroom)
      Checkbox.create(user: user, objective: add_students)
      expect(analyzer).not_to receive(:track_event_from_string).with("TEACHER_COMPLETED_ONBOARDING_CHECKLIST", user.id)
      subject.perform(user.id)
    end

    it 'should not track the event if there are not checkboxes for that user and any onboarding objectives' do
      expect(analyzer).not_to receive(:track_event_from_string).with("TEACHER_COMPLETED_ONBOARDING_CHECKLIST", user.id)
      subject.perform(user.id)
    end

  end
end
