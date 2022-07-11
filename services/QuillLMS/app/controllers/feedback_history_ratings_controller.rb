# frozen_string_literal: true

class FeedbackHistoryRatingsController < ApplicationController
  before_action :set_feedback_history_rating, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token

  def create_or_update
    rating =
      create_or_update_feedback_history_rating(
        feedback_history_rating_params["feedback_history_id"],
        feedback_history_rating_params["rating"]
      )

    if rating.valid?
      rating.save!
      render(json: {status: 200})
    else
      render(json: {status: 406, message: rating.errors})
    end
  end

  def mass_mark
    ratings = mass_mark_params[:feedback_history_ids].map { |id| create_or_update_feedback_history_rating(id, mass_mark_params["rating"]) }

    if ratings.all? { |r| r.valid? }
      ratings.each { |r| r.save! }
    else
      render json: {error_messages: records.map { |r| r.errors }.join('; ')}, status: :unprocessable_entity
    end
    render(json: {status: 200})
  end

  private def create_or_update_feedback_history_rating(id, value)
    rating = FeedbackHistoryRating.find_or_initialize_by(
      user_id: current_user.id,
      feedback_history_id: id
    )

    rating.rating = value
    rating
  end

  private def feedback_history_rating_params
    params.require(:feedback_history_rating).permit([:rating, :feedback_history_id])
  end

  private def mass_mark_params
    params.permit([:rating, feedback_history_ids: []])
  end
end
