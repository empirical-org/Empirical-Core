module Comprehension
  require 'json'

  class FeedbackController < ApplicationController
    skip_before_action :verify_authenticity_token
    PLAGIARISM_TYPE = 'plagiarism'

    def plagiarism
      entry = params[:entry]
      begin
        prompt = Comprehension::Prompt.find(params[:prompt_id])
      rescue ActiveRecord::RecordNotFound
        return render :body => nil, :status => 404
      end
      session_id = params[:session_id]
      previous_feedback = params[:previous_feedback]

      passage = prompt.rules&.find{|r| r.rule_type = Comprehension::Rule::TYPE_PLAGIARISM}&.plagiarism_text&.text || ''

      feedback = get_feedback_from_previous_feedback(previous_feedback, prompt)

      plagiarism_check = Comprehension::PlagiarismCheck.new(entry, passage, feedback)

      render json: {
        feedback: plagiarism_check.feedback,
        feedback_type: PLAGIARISM_TYPE,
        optimal: plagiarism_check.optimal?,
        response_id: '',
        entry: entry,
        highlight: plagiarism_check.highlights
      }
    end

    private def get_feedback_from_previous_feedback(prev, prompt)
      previous_plagiarism = prev.select {|f| f["feedback_type"] == PLAGIARISM_TYPE && f["optimal"] == false }
      feedbacks = prompt.rules&.find {|r| r.rule_type == Comprehension::Rule::TYPE_PLAGIARISM }&.feedbacks
      previous_plagiarism.empty? ? feedbacks&.find { |f| f.order == 0}&.text : feedbacks&.find { |f| f.order == 1}&.text
    end
  end
end
