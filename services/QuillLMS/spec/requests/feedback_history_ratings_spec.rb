require 'rails_helper'

RSpec.describe "FeedbackHistoryRatings", type: :request do
  describe "GET /feedback_history_ratings" do
    it "works! (now write some real specs)" do
      get feedback_history_ratings_path
      expect(response).to have_http_status(200)
    end
  end
end
