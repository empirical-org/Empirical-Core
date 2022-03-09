# frozen_string_literal: true

module Evidence
  require 'json'

  class FeedbackController < ApiController
    before_action :set_params, only: [:automl, :plagiarism, :regex, :spelling, :create]

    CHECKS = [
      Check::Prefilter,
      # Check::RegexSentence,
      Check::Opinion,
      # Check::Plagiarism,
      Check::AutoML,
      # Check::RegexPostTopic,
      Check::Grammar,
      Check::Spelling
      # Check::RegexType
    ]

    def create
      autoML_feedback = nil
      nonoptimal_feedback = nil

      CHECKS.each do |check|
        feedback = check.run(@entry, @prompt, @previous_feedback)

        next unless feedback.success?

        autoML_feedback = feedback if feedback.autoML?

        next if feedback.optimal?

        nonoptimal_feedback = feedback

        break
      end

      feedback = nonoptimal_feedback || autoML_feedback

      # TODO store feedback history

      render json: feedback&.response || {}
    end

    def grammar
      grammar_client = Grammar::Client.new(entry: params['entry'], prompt_text: params['prompt_text'])
      render json: Grammar::FeedbackAssembler.run(grammar_client.post)
    end

    def opinion
      oapi_client = Opinion::Client.new(entry: params['entry'], prompt_text: params['prompt_text'])
      render json: Opinion::FeedbackAssembler.run(oapi_client.post)
    end

    def prefilter
      prefilter_check = Evidence::PrefilterCheck.new(prefilter_params)
      render json: prefilter_check.feedback_object
    end

    def plagiarism
      rule = @prompt.rules&.find_by(rule_type: Evidence::Rule::TYPE_PLAGIARISM)
      feedback = get_plagiarism_feedback_from_previous_feedback(@previous_feedback, rule)

      if rule.plagiarism_texts.none?
        render json: Evidence::PlagiarismCheck.new(@entry, '', feedback, rule).feedback_object
      else
        plagiarism_check = nil
        rule.plagiarism_texts.each do |plagiarism_text|
          plagiarism_check = Evidence::PlagiarismCheck.new(@entry, plagiarism_text.text, feedback, rule)
          break unless plagiarism_check.feedback_object[:optimal]
        end
        return render json: plagiarism_check.feedback_object
      end
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

    # rubocop:disable Metrics/CyclomaticComplexity
    private def get_plagiarism_feedback_from_previous_feedback(prev, rule)
      previous_plagiarism = prev.select {|f| f["feedback_type"] == Evidence::Rule::TYPE_PLAGIARISM && f["optimal"] == false }
      feedbacks = rule&.feedbacks
      previous_plagiarism.empty? ? feedbacks&.find_by(order: 0)&.text : feedbacks&.find_by(order: 1)&.text
    end
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
