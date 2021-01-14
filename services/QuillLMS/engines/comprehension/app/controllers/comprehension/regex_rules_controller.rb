module Comprehension
  class RegexRulesController < ApplicationController
    before_action :set_rule_set
    before_action :set_rule, only: [:show, :update, :destroy]

    # GET /rules.json
    def index
      @rules = @rule_set.rules

      render json: @rules
    end

    # GET /rules/1.json
    def show
      render json: @rule
    end

    # POST /rules.json
    def create
      @rule = @rule_set.rules.build(rule_params)

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
      def set_rule_set
        @rule_set = RuleSet.find(params[:rule_set_id])
      end

      def set_rule
        @rule = @rule_set.rules.find(params[:id])
      end

      def rule_params
        params.require(:rule).permit(:regex_text, :case_sensitive)
      end
  end
end
