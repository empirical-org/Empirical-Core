class Api::V1::FeedbackHistoriesController < Api::ApiController
  before_action :set_feedback_history, only: [:show, :update, :destroy]

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
    @feedback_history = FeedbackHistory.new(rename_activity_session_uid_params_key(feedback_history_params))

    if @feedback_history.save
      render json: @feedback_history, status: :created
    else
      render json: @feedback_history.errors, status: :unprocessable_entity
    end
  end

  # POST /feedback_histories/batch.json
  def batch
    records = FeedbackHistory.batch_create(batch_feedback_history_params.map{ |payload| rename_activity_session_uid_params_key(payload) })
    if records.length && records.all? { |r| r.valid? }
      head :created
    else
      render json: {feedback_histories: records.map { |r| r.errors }}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /feedback_histories/1.json
  def update
    @feedback_history.update(feedback_history_params)

    if @feedback_history.save
      head :no_content
    else
      render json: @feedback_history.errors, status: :unprocessable_entity
    end
  end

  # DELETE /feedback_histories/1.json
  def destroy
    @feedback_history.destroy
    head :no_content
  end

  private def set_feedback_history
    @feedback_history = FeedbackHistory.find_by!(id: params[:id])
  end

  private def feedback_history_params
    params.require(:feedback_history).permit(
      :activity_session_uid,
      :prompt_id,
      :concept_uid,
      :attempt,
      :entry,
      :feedback_text,
      :feedback_type,
      :optimal,
      :used,
      :time,
      :metadata,
      :rule_uid
    )
  end

  private def batch_feedback_history_params
    # Note: nested params MUST be permitted last in any list
    params.permit(
      feedback_histories: [
        :activity_session_uid,
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
          :response_id,
          highlight: []
        ]
      ]
    )[:feedback_histories]
  end

  private def rename_activity_session_uid_params_key(params_hash)
    # We've changed the name of the model param in FeedbackHistory, but don't (currently)
    # want to go back and change every single Feedback API in our stack to use a new signature.
    # This swap allows us to maintain the current API while making the new code work.
    params_hash[:feedback_session_uid] = params_hash.delete(:activity_session_uid)
    params_hash
  end
end
