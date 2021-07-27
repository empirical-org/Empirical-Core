module Comprehension
  class RulesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_rule, only: [:show, :update, :destroy]

    # GET /rules.json
    def index
      @rules = Comprehension::Rule
      @rules = @rules.joins(:prompts_rules).where(comprehension_prompts_rules: {prompt_id: params[:prompt_id].split(',')}) if params[:prompt_id]
      @rules = @rules.where(rule_type: params[:rule_type]) if params[:rule_type]

      # some rules will apply to multiple prompts so we only want to return them once
      render json: @rules.distinct.all
    end

    # GET /rules/1.json
    def show
      render json: @rule
    end

    # POST /rules.json
    def create
      @rule = Comprehension::Rule.new(rule_params)

      if @rule.save
        render json: @rule, status: :created
      else
        render json: @rule.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /rules/1.json
    def update
      if @rule.update(rule_params)
        head :no_content
      else
        render json: @rule.errors, status: :unprocessable_entity
      end
    end

    # DELETE /rules/1.json
    def destroy
      @rule.destroy
      head :no_content
    end

    def update_rule_order
      ordered_rules = ordered_rules_params[:ordered_rule_ids].map.with_index do |id, index|
        rule = Comprehension::Rule.find_by_id(id)
        rule.suborder = index if rule
        rule
      end

      if ordered_rules.all? { |r| r&.valid? }
        ordered_rules.each { |r| r.save! }
        render(json: {status: 200})
      else
        render json: {error_messages: ordered_rules.map { |r| r&.errors }.join('; ')}, status: :unprocessable_entity
      end
    end

    private def set_rule
      # warning - the id param is getting used as both an id and a uid, which is an antipattern
      @rule = Comprehension::Rule.find_by_uid(params[:id]) || Comprehension::Rule.find_by_id(params[:id])
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

    private def ordered_rules_params
      params.permit(ordered_rule_ids: [])
    end
  end
end
