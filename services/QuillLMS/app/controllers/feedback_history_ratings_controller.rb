class FeedbackHistoryRatingsController < ApplicationController
  before_action :set_feedback_history_rating, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def create_or_update
    rating = FeedbackHistoryRating.find_or_initialize_by(
      user_id: current_user.id,
      feedback_history_id: feedback_history_rating_params["feedback_history_id"]
    )

    rating.rating = feedback_history_rating_params["rating"]

    if rating.valid?
      rating.save!
      render(json: {status: 200})
    else
      render(json: {status: 406, message: rating.errors})
    end
  end

  private def feedback_history_rating_params
    params.require(:feedback_history_rating).permit([:rating, :feedback_history_id])
  end
end
