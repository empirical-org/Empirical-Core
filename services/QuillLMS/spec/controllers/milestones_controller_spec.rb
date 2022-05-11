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

  describe '#complete_acknowledge_diagnostic_banner' do
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
end
