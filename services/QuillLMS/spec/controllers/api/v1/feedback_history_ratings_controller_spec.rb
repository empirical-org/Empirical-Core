require 'rails_helper'

RSpec.describe Api::V1::FeedbackHistoryRatingsController, type: :controller do

  let(:invalid_attributes) {
    {}
  }


  describe "PUT #create_or_update" do
    context "with valid params" do
      it "should attach to an existing FeedbackHistory" do
        f_h = create(:feedback_history)
        user = create(:user)
        valid_attributes = {
          rating: FeedbackHistoryRating::RATINGS.first,
          user_id: user.id,
          feedback_history_id: f_h.id
        }

        expect {
          post :create_or_update, {:feedback_history_rating => valid_attributes}
        }.to change(FeedbackHistoryRating, :count).by(1)
      end
    end

    context "with invalid params" do
      it "returns a success response (i.e. to display the 'new' template)" do
        expect do 
          post :create_or_update, {:feedback_history_rating => invalid_attributes}
        end.to raise_error(ActionController::ParameterMissing)
      end
    end
  end

end
