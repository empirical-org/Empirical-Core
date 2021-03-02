module Comprehension
  class RulesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_rule, only: [:show, :update, :destroy]

    # GET /rules.json
    def index
      @rules = Comprehension::Rule.all

      render json: @rules
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

    private def set_rule
      @rule = Comprehension::Rule.find(params[:id])
    end

    private def rule_params
      params.require(:rule).permit(:name, :description, :universal, :rule_type, :optimal, :state, :suborder, :concept_uid,
         prompt_ids: [],
         plagiarism_text_attributes: [:id, :text],
         regex_rules_attributes: [:id, :regex_text, :case_sensitive, :sequence_type],
         label_attributes: [:id, :name, :state],
         feedbacks_attributes: [:id, :text, :description, :order, highlights_attributes: [:id, :text, :highlight_type, :starting_index]]
      )
    end
  end
end
