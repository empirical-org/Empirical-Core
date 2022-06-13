# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FeedbackHistoryRatingsController, type: :controller do

  let(:user) {create(:user)}

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe "PUT #create_or_update" do
    context 'updating a record' do

      context 'with valid params that have a nil rating' do
        it 'should update an existing record' do
          f_h = create(:feedback_history)

          f_h_r = create(:feedback_history_rating, {
            user_id: user.id,
            rating: true,
            feedback_history_id: f_h.id
          })

          expect do
            post :create_or_update, params: { :feedback_history_rating => {
              rating: nil,
              feedback_history_id: f_h.id
            } }
          end.to change(FeedbackHistoryRating, :count).by(0)
          expect(FeedbackHistoryRating.find_by(
            user_id: user.id,
            feedback_history_id: f_h.id
          ).rating).to eq nil
        end
      end

      context 'with valid params that have a boolean rating' do
        it 'should update an existing record' do
          f_h = create(:feedback_history)

          f_h_r = create(:feedback_history_rating, {
            user_id: user.id,
            rating: true,
            feedback_history_id: f_h.id
          })

          expect do
            post :create_or_update, params: { :feedback_history_rating => {
              rating: false,
              feedback_history_id: f_h.id
            } }
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
            post :create_or_update, params: { :feedback_history_rating => valid_attributes }
          }.to change(FeedbackHistoryRating, :count).by(1)
        end
      end


      context "with invalid params" do
        it "should raise ParameterMissing" do
          expect do
            post :create_or_update, params: { :feedback_history_rating => {} }
          end.to raise_error(ActionController::ParameterMissing)
        end
      end
    end

  end

  describe "PUT #mass_mark" do
    it "should create or update all relevant records" do
      f_h1 = create(:feedback_history)
      f_h2 = create(:feedback_history)

      f_h_r = create(:feedback_history_rating, {
        user_id: user.id,
        rating: true,
        feedback_history_id: f_h1.id
      })

      expect do
        post :mass_mark, params: { rating: false, feedback_history_ids: [f_h1.id, f_h2.id] }
      end.to change(FeedbackHistoryRating, :count).by(1)
      expect(FeedbackHistoryRating.find_by(
        user_id: user.id,
        feedback_history_id: f_h2.id
      ).rating).to eq false
    end


  end

end
