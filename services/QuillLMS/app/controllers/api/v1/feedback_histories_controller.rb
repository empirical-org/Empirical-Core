# frozen_string_literal: true

class Api::V1::FeedbackHistoriesController < Api::ApiController
  before_action :set_feedback_history, only: [:show]

  # GET /feedback_histories.json
  def index
    @feedback_histories = FeedbackHistory.all

    render json: { feedback_histories: @feedback_histories }
  end

  # GET /feedback_histories/1.json
  def show
    render json: @feedback_history
  end

  # POST /feedback_histories.json
  def create
    @feedback_history = FeedbackHistory.new(feedback_history_params)

    if @feedback_history.save
      render json: @feedback_history, status: :created
    else
      render json: @feedback_history.errors, status: :unprocessable_entity
    end
  end

  private def set_feedback_history
    @feedback_history = FeedbackHistory.find_by!(id: params[:id])
  end

  private def feedback_history_params
    params.require(:feedback_history).permit(
      :feedback_session_uid,
      :prompt_id,
      :concept_uid,
      :attempt,
      :entry,
      :feedback_text,
      :feedback_type,
      :optimal,
      :used,
      :time,
      :rule_uid,
      :activity_version,
      metadata: [
        highlight: [
          :text,
          :type,
          :category,
          :character
        ]
      ]
    )
  end

end
