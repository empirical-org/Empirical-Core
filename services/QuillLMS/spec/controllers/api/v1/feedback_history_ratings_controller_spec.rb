require 'rails_helper'

RSpec.describe Api::V1::FeedbackHistoryRatingsController, type: :controller do

  # This should return the minimal set of attributes required to create a valid
  # FeedbackHistoryRating. As you add validations to FeedbackHistoryRating, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  let(:valid_session) { {} }

  describe "PUT #create_or_update" do
    context "with valid params" do
      it "creates a new FeedbackHistoryRating" do
        expect {
          post :create, {:feedback_history_rating => valid_attributes}, valid_session
        }.to change(FeedbackHistoryRating, :count).by(1)
      end
    end

    context "with invalid params" do
      it "returns a success response (i.e. to display the 'new' template)" do
        post :create_or_update, {:feedback_history_rating => invalid_attributes}, valid_session
        expect(response).to be_success
      end
    end
  end

end
