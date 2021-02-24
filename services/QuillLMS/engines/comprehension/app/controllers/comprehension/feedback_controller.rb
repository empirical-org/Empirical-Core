module Comprehension
  require 'json'

  class FeedbackController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_params, only: [:plagiarism, :regex]

    def plagiarism
      rule = @prompt.rules&.find_by(rule_type: Comprehension::Rule::TYPE_PLAGIARISM)
      passage = rule&.plagiarism_text&.text || ''
      feedback = get_plagiarism_feedback_from_previous_feedback(@previous_feedback, @prompt)

      plagiarism_check = Comprehension::PlagiarismCheck.new(@entry, passage, feedback, rule)

      render json: plagiarism_check.feedback_object
    end

    def regex
      rule_type = params[:rule_type]
      regex_check = Comprehension::RegexCheck.new(@entry, @prompt, rule_type)
      render json: regex_check.feedback_object
    end

    private def set_params
      @entry = params[:entry]
      begin
        @prompt = Comprehension::Prompt.find(params[:prompt_id])
      rescue ActiveRecord::RecordNotFound
        return render :body => nil, :status => 404
      end
      @session_id = params[:session_id]
      @previous_feedback = params[:previous_feedback]
    end

    private def get_plagiarism_feedback_from_previous_feedback(prev, prompt)
      previous_plagiarism = prev.select {|f| f["feedback_type"] == Comprehension::Rule::TYPE_PLAGIARISM && f["optimal"] == false }
      feedbacks = prompt.rules&.find_by(rule_type: Comprehension::Rule::TYPE_PLAGIARISM)&.feedbacks
      previous_plagiarism.empty? ? feedbacks&.find_by(order: 0)&.text : feedbacks&.find_by(order: 1)&.text
    end
  end
end
