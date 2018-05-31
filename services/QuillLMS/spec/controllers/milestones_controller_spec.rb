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
end