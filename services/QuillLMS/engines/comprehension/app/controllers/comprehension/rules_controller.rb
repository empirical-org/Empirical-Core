module Comprehension
  class RulesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_rule, only: [:show, :update, :destroy]
    before_action :save_nested_vars_for_log, only: [:create, :update]

    # GET /rules.json
    def index
      @rules = Comprehension::Rule
      @rules = @rules.joins(:prompts_rules).where(comprehension_prompts_rules: {prompt_id: params[:prompt_id].split(',')}) if params[:prompt_id]
      @rules = @rules.where(rule_type: params[:rule_type]) if params[:rule_type]

      # some rules will apply to multiple prompts so we only want to return them once
      render json: @rules.uniq.all
    end

    # GET /rules/1.json
    def show
      render json: @rule
    end

    # POST /rules.json
    def create
      @rule = Comprehension::Rule.new(rule_params)
      if @rule.save
        @rule.log_creation(lms_user_id)
        @rule.label.log_creation(lms_user_id) if @rule.label.present?
        render json: @rule, status: :created
      else
        render json: @rule.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /rules/1.json
    def update
      if @rule.update(rule_params)
        @rule.log_update(lms_user_id, @rule_vals)
        @rule.log_update(lms_user_id, @prev_name) if @prev_name.present?
        log_nested_changes
        head :no_content
      else
        render json: @rule.errors, status: :unprocessable_entity
      end
    end

    # DELETE /rules/1.json
    def destroy
      @rule.log_deletion(lms_user_id)
      @rule.label&.log_deletion(lms_user_id)
      @rule.destroy
      head :no_content
    end

    private def set_rule
      # warning - the id param is getting used as both an id and a uid, which is an antipattern
      @rule = Comprehension::Rule.find_by_uid(params[:id]) || Comprehension::Rule.find(params[:id])
    end

    private def rule_params
      params.require(:rule).permit(:name, :note, :universal, :rule_type, :optimal, :state, :suborder, :concept_uid,
         prompt_ids: [],
         plagiarism_text_attributes: [:id, :text],
         regex_rules_attributes: [:id, :regex_text, :case_sensitive, :sequence_type],
         label_attributes: [:id, :name, :state],
         feedbacks_attributes: [:id, :text, :description, :order, highlights_attributes: [:id, :text, :highlight_type, :starting_index]]
      )
    end

    private def save_nested_vars_for_log
      @prev_name = nil
      @feedback_vals = []
      @highlights_vals = []
      @plagiarism_text_vals = []
      @regex_rules_vals = []
      @rule_vals = []

      label = Comprehension::Rule.find_by_id(params[:id])&.label
      if label.present?
        label_string = "#{label.name} | #{Comprehension::Rule.find(params[:id]).name}"
        if rule_params[:name]
          @prev_name = label_string
        end
        rule_params[:feedbacks_attributes]&.each do |fa|
          old_feedback = Comprehension::Feedback.find_by_id(fa[:id])&.text
          @feedback_vals.push({id: fa[:id], value: "#{label_string}\n#{old_feedback}"}) if fa[:id] && fa[:text] && fa[:text] != old_feedback
          fa[:highlights_attributes]&.each do |ha|
            old_highlight = Comprehension::Highlight.find(ha[:id]).text
            @highlights_vals.push({id: ha[:id], value: "#{label_string}\n#{old_highlight}"}) if ha[:id] && ha[:text] && ha[:text] != old_highlight
          end
        end
      end

      rule_params[:regex_rules_attributes]&.each do |rr|
        old_regex = Comprehension::RegexRule.find_by_id(rr[:id])&.regex_text
        @regex_rules_vals.push({id: rr[:id], regex_text: old_regex || rr[:regex_text]}) if rr[:regex_text] && rr[:regex_text] != old_regex
      end

      if rule_params[:plagiarism_text_attributes]&.key?(:text)
        pt = rule_params[:plagiarism_text_attributes]
        old_text = Comprehension::PlagiarismText.find_by_id(pt[:id])&.text
        @plagiarism_text_vals.push({id: pt[:id], text: old_text || pt[:text]}) if pt[:text] && pt[:text] != old_text
      end

      rule = Comprehension::Rule.find_by_id(params[:id])
      if rule.present?
        rule_params.except(:prompt_ids, :plagiarism_text_attributes, :regex_rules_attributes, :label_attributes, :feedbacks_attributes).each do |key, value|
          if rule.send(key) != value
            rule_obj = {}
            rule_obj[key] = rule.send(key)
            @rule_vals.push(rule_obj)
          end
        end
      end
    end

    private def log_nested_changes
      @feedback_vals.each do |f|
        Comprehension::Feedback.find(f[:id]).log_update(lms_user_id, f[:value])
      end
      @highlights_vals.each do |h|
        Comprehension::Highlight.find(h[:id]).log_update(lms_user_id, h[:value])
      end
      @regex_rules_vals.each do |r|
        if r[:id]
          Comprehension::RegexRule.find(r[:id]).log_update(lms_user_id, r[:regex_text])
        else
          Comprehension::RegexRule.find_by(regex_text: r[:regex_text]).log_update(lms_user_id, nil)
        end
      end
      @plagiarism_text_vals.each do |pt|
        if pt[:id]
          Comprehension::PlagiarismText.find(pt[:id]).log_update(lms_user_id, pt[:value])
        else
          Comprehension::PlagiarismText.find_by(text: pt[:text]).log_update(lms_user_id, nil)
        end
      end
    end
  end
end
