# frozen_string_literal: true

require 'rails_helper'

describe MilestonesController do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#complete_view_lesson_tutorial' do
    let!(:milestone) { create(:milestone, name: 'View Lessons Tutorial') }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_view_lesson_tutorial
      expect(user.milestones).to include milestone
    end
  end

  describe '#complete_acknowledge_lessons_banner' do
    let!(:milestone) { create(:acknowledge_lessons_banner) }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_acknowledge_lessons_banner
      expect(user.milestones).to include milestone
    end
  end

  describe '#complete_acknowledge_diagnostic_banner' do
    let!(:milestone) { create(:acknowledge_diagnostic_banner) }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_acknowledge_diagnostic_banner
      expect(user.milestones).to include milestone
    end
  end

  describe '#complete_acknowledge_evidence_banner' do
    let!(:milestone) { create(:acknowledge_evidence_banner) }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_acknowledge_evidence_banner
      expect(user.milestones).to include milestone
    end
  end

  describe '#complete_acknowledge_growth_diagnostic_promotion_card' do
    let!(:milestone) { create(:acknowledge_growth_diagnostic_promotion_card) }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_acknowledge_growth_diagnostic_promotion_card
      expect(user.milestones).to include milestone
    end
  end

  describe '#complete_dismiss_grade_level_warning' do
    let!(:milestone) { create(:dismiss_grade_level_warning) }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_dismiss_grade_level_warning
      expect(user.milestones).to include milestone
    end
  end

  describe '#complete_dismiss_school_selection_reminder' do
    let!(:milestone) { create(:dismiss_school_selection_reminder) }

    it 'should push the milestone into users milestones' do
      expect(user.milestones).to_not include milestone
      post :complete_dismiss_school_selection_reminder
      expect(user.milestones).to include milestone
    end
  end

  describe '#create_or_touch_dismiss_teacher_info_modal' do
    let!(:milestone) { create(:dismiss_teacher_info_modal) }

    it 'should push the milestone into users milestones if it does not already exist' do
      expect(user.milestones).to_not include milestone
      post :create_or_touch_dismiss_teacher_info_modal
      expect(user.reload.milestones).to include milestone
    end

    it 'should update the user milestone timestamp if it does already exist' do
      user_milestone = create(:user_milestone, milestone: milestone, user: user, updated_at: 1.week.ago)

      Timecop.freeze

      post :create_or_touch_dismiss_teacher_info_modal
      expect(user_milestone.reload.updated_at).to be_within(1.second).of Time.now.utc
    end
  end

end
