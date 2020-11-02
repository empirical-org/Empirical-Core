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
      render json: records, status: :created
    else
      render json: records.map { |r| r.errors }, status: :unprocessable_entity
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
    p = params.require(:feedback_history).permit(
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
      :metadata
    )
    # the `prompt` relationship is polymorphic, but at the moment,
    # there's only one model it can relate to, and this is it
    p[:prompt_type] = "Comprehension::Prompt" if p[:prompt_id]
    p
  end

  private def batch_feedback_history_params
    p = params.permit(feedback_histories: [
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
      :metadata
    ])[:feedback_histories]
    return [] if !p
    p.map do |feedback_history|
      # the `prompt` relationship is polymorphic, but at the moment,
      # there's only one model it can relate to, and this is it
      feedback_history[:prompt_type] = "Comprehension::Prompt" if feedback_history[:prompt_id]
      feedback_history
    end
  end
end
