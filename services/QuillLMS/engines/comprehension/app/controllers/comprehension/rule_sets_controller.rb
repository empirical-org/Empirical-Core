module Comprehension
  class RuleSetsController < ApplicationController
    before_action :set_activity
    before_action :set_rule_set, only: [:show, :update, :destroy]

    # GET /rule_sets.json
    def index
      @rule_sets = @activity.rule_sets

      render json: @rule_sets
    end

    # GET /rule_sets/1.json
    def show
      render json: @rule_set
    end

    # POST /rule_sets.json
    def create
      @rule_set = @activity.rule_sets.build(rule_set_params)

      if @rule_set.save
        render json: @rule_set, status: :created
      else
        render json: @rule_set.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /rule_sets/1.json
    def update
      if @rule_set.update(rule_set_params)
        render json: @rule_set, status: :accepted
      else
        render json: @rule_set.errors, status: :unprocessable_entity
      end
    end

    # DELETE /rule_sets/1.json
    def destroy
      @rule_set.destroy
      head :no_content
    end

    private def set_activity
      @activity = Comprehension::Activity.find(params[:activity_id])
    end

    private def set_rule_set
      @rule_set = @activity.rule_sets.find(params[:id])
    end

    private def rule_set_params
      params.require(:rule_set).permit(
        :name,
        :feedback,
        :priority,
        prompt_ids: [],
        regex_rules_attributes: [:id, :rule_set_id, :regex_text, :case_sensitive]
      )
    end
  end
end
