module Comprehension
  class RuleSetsController < ApplicationController
    before_action :set_rule_set, only: [:show, :update, :destroy]

    # GET /rule_sets.json
    def index
      @rule_sets = RuleSet.where(activity_id: params[:activity_id]).all

      render json: @rule_sets
    end

    # GET /rule_sets/1.json
    def show
      render json: @rule_set
    end

    # POST /rule_sets.json
    def create
      @rule_set = RuleSet.new({
        activity_id: params[:activity_id]
      }.merge(rule_set_params))

      if @rule_set.save
        render json: @rule_set, status: :created
      else
        render json: @rule_set.errors, status: :unprocessable_entity
      end
    end


    # PATCH/PUT /rule_sets/1.json
    def update
      update_params = rule_set_params.merge({
        prompt_ids: Prompt.all.map { |p| p.id }
      })
      if @rule_set.update(update_params)
        head :no_content
      else
        render json: @rule_set.errors, status: :unprocessable_entity
      end
    end

    # DELETE /rule_sets/1.json
    def destroy
      @rule_set.destroy
      head :no_content
    end

    private
      def set_rule_set
        @rule_set = RuleSet.find_by!(activity_id: params[:activity_id], id: params[:id])
      end

      def rule_set_params
        params.require(:rule_set).permit(
          :name,
          :feedback,
          :priority,
          prompt_ids: [],
          rules_attributes: [:id, :regex_text, :case_sensitive]
        )
      end
  end
end
