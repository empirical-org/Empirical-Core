module Comprehension
  class RulesController < ApplicationController
    before_action :set_activity_and_rule_set
    before_action :set_rule, only: [:show, :update, :destroy]

    # GET /rules.json
    def index
      @rules = Rule.all

      render json: @rules
    end

    # GET /rules/1.json
    def show
      render json: @rule
    end

    # POST /rules.json
    def create
      @rule = Rule.new({
        rule_set_id: params[:rule_set_id],
      }.merge(rule_params))

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

    private
      def set_rule
        @rule = Rule.find_by!(rule_set: @rule_set, id: params[:id])
      end

      def rule_params
        params.require(:rule).permit(:regex_text, :case_sensitive)
      end

      def set_activity_and_rule_set
        @activity = Activity.find(params[:activity_id])
        @rule_set = RuleSet.find_by!(activity_id: params[:activity_id], id: params[:rule_set_id])
      end
  end
end
