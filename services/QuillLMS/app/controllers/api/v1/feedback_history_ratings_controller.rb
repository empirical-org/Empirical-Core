class Api::V1::FeedbackHistoryRatingsController < ApplicationController
  before_action :set_feedback_history_rating, only: [:show, :edit, :update, :destroy]

  def create_or_update
    @feedback_history_rating = FeedbackHistoryRating.create_or_update!(feedback_history_rating_params)
    render(json: @feedback_history_rating)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_feedback_history_rating
      @feedback_history_rating = FeedbackHistoryRating.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def feedback_history_rating_params
      params.require(:feedback_history_rating).permit(:rating)
    end
end
