require 'rails_helper'

RSpec.describe FeedbackHistoryRatingsController, type: :controller do

  let(:user) {create(:user)}
  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe "PUT #create_or_update" do
    context 'updating a record' do 
      context 'with valid params' do 
        it 'should update an existing record' do 
          f_h = create(:feedback_history)
          
          f_h_r = create(:feedback_history_rating, {
            user_id: user.id,
            rating: true,
            feedback_history_id: f_h.id
          })

          expect do
            post :create_or_update, {:feedback_history_rating => {
              rating: false,
              feedback_history_id: f_h.id              
            }}
          end.to change(FeedbackHistoryRating, :count).by(0)
          expect(FeedbackHistoryRating.find_by(
            user_id: user.id, 
            feedback_history_id: f_h.id
          ).rating).to eq false
        end
      end
    end

    context 'new record' do 
      context "with valid params" do
        it "should attach to an existing FeedbackHistory" do
          f_h = create(:feedback_history)
          user = create(:user)
          valid_attributes = {
            rating: true,
            feedback_history_id: f_h.id
          }
  
          expect {
            post :create_or_update, {:feedback_history_rating => valid_attributes}
          }.to change(FeedbackHistoryRating, :count).by(1)
        end
      end
  
      context "with invalid params" do
        it "should raise ParameterMissing" do
          expect do 
            post :create_or_update, {:feedback_history_rating => {}}
          end.to raise_error(ActionController::ParameterMissing)
        end
      end
    end

  end

end
