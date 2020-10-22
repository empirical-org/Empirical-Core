require_dependency 'comprehension/application_controller'

module Comprehension
  class FeedbackHistoriesController < ApplicationController
    before_action :set_feedback_history, only: [:show, :update, :destroy]

    # GET /feedback_histories.json
    def index
      @feedback_histories = Comprehension::FeedbackHistory.all

      render json: @feedback_histories
    end

    # GET /feedback_histories/1.json
    def show
      render json: @feedback_history
    end

    # POST /feedback_histories.json
    def create
      @feedback_history = Comprehension::FeedbackHistory.new(feedback_history_params)
      set_prompt_if_present

      if @feedback_history.save
        render json: @feedback_history, status: :created
      else
        render json: @feedback_history.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /feedback_histories/1.json
    def update
      @feedback_history.update(feedback_history_params)
      set_prompt_if_present

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
      @feedback_history = Comprehension::FeedbackHistory.find(params[:id])
    end

    private def set_prompt_if_present
      # Technically Prompt is configured to be polymorphic, but at this time we only
      # support a single model as Prompt, and this is it
      return if !feedback_history_params[:prompt_id]
      @feedback_history.prompt = Prompt.find(feedback_history_params[:prompt_id])
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
        :metadata
      )
    end
  end
end
