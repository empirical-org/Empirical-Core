# frozen_string_literal: true

module Evidence
  require 'json'

  class FeedbackController < ApiController
    before_action :set_params, only: [:create]

    def create
      feedback = Check.get_feedback(@entry, @prompt, @previous_feedback, @feedback_types)

      save_feedback_history(feedback)

      # api-specific data doesn't need to be sent to the client
      render json: feedback.except(:api)
    end

    private def set_params
      @entry = params[:entry]
      return render(:body => nil, :status => 404) unless @entry

      begin
        @prompt = Evidence::Prompt.find(params[:prompt_id])
      rescue ActiveRecord::RecordNotFound
        return render :body => nil, :status => 404
      end
      @session_id = params[:session_id]
      @previous_feedback = params[:previous_feedback]
      @feedback_types = params[:feedback_types]
    end

    private def save_feedback_history(feedback)
      return unless feedback

      api_metadata = feedback[:api]
      feedback = feedback.except(:api)
      attempt = params[:attempt] || 0

      Evidence.feedback_history_class.save_feedback(feedback, @entry, @prompt.id, @session_id, attempt, api_metadata)
    end

  end
end
