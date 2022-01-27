# frozen_string_literal: true

class Api::V1::FeedbackHistoriesController < Api::ApiController
  before_action :set_feedback_history, only: [:show]

  # GET /feedback_histories.json
  def index
    @feedback_histories = FeedbackHistory.all

    render json: @feedback_histories
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

  # POST /feedback_histories/batch.json
  def batch
    records = FeedbackHistory.batch_create(batch_feedback_history_params)
    if records.length && records.all? { |r| r.valid? }
      head :created
    else
      render json: {feedback_histories: records.map { |r| r.errors }}, status: :unprocessable_entity
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

  private def batch_feedback_history_params
    # NOTE: nested params MUST be permitted last in any list
    params.permit(
      feedback_histories: [
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
        metadata: [
          highlight: [
            :text,
            :type,
            :category,
            :character
          ]
        ]
      ]
    )[:feedback_histories]
  end
end
