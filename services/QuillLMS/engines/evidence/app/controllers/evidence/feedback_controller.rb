# frozen_string_literal: true

module Evidence
  require 'json'

  class FeedbackController < ApiController
    before_action :set_params, only: [:automl, :plagiarism, :regex, :spelling]

    def prefilter 
      prefilter_check = Evidence::PrefilterCheck.new(prefilter_params)
      render json: prefilter_check.feedback_object
    end

    def plagiarism
      rule = @prompt.rules&.find_by(rule_type: Evidence::Rule::TYPE_PLAGIARISM)
      passage = rule&.plagiarism_text&.text || ''
      feedback = get_plagiarism_feedback_from_previous_feedback(@previous_feedback, rule)

      plagiarism_check = Evidence::PlagiarismCheck.new(@entry, passage, feedback, rule)
      fuzzy_plagiarism_check = Evidence::FuzzyPlagiarismCheck.new(@entry, passage, feedback, rule)

      base_feedback = plagiarism_check.feedback_object
      return render json: base_feedback unless base_feedback[:optimal]
      return render json: fuzzy_plagiarism_check.feedback_object
    end

    def regex
      rule_type = params[:rule_type]
      return render :body => nil, :status => 404 if !Evidence::Rule::TYPES.include? rule_type
      regex_check = Evidence::RegexCheck.new(@entry, @prompt, rule_type)
      render json: regex_check.feedback_object
    end

    def automl
      automl_check = Evidence::AutomlCheck.new(@entry, @prompt, @previous_feedback)
      feedback_object = automl_check.feedback_object
      return render :body => nil, :status => 404 unless feedback_object
      render json: feedback_object
    end

    def spelling
      spelling_check = Evidence::SpellingCheck.new(@entry)
      return render :body => {:error => spelling_check.error }.to_json, :status => 500 if spelling_check.error.present?
      render json: spelling_check.feedback_object
    end

    private def prefilter_params
      params.require(:entry)
    end 

    private def set_params
      @entry = params[:entry]
      begin
        @prompt = Evidence::Prompt.find(params[:prompt_id])
      rescue ActiveRecord::RecordNotFound
        return render :body => nil, :status => 404
      end
      @session_id = params[:session_id]
      @previous_feedback = params[:previous_feedback]
    end

    private def get_plagiarism_feedback_from_previous_feedback(prev, rule)
      previous_plagiarism = prev.select {|f| f["feedback_type"] == Evidence::Rule::TYPE_PLAGIARISM && f["optimal"] == false }
      feedbacks = rule&.feedbacks
      previous_plagiarism.empty? ? feedbacks&.find_by(order: 0)&.text : feedbacks&.find_by(order: 1)&.text
    end
  end
end
