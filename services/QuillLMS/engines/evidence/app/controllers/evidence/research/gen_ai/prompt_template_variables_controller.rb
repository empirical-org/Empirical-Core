# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class PromptTemplateVariablesController < ApplicationController
        def index = @prompt_template_variables = PromptTemplateVariable.all

        def new
          @names = PromptTemplateVariable::NAMES
          @prompt_template_variable = PromptTemplateVariable.new
        end

        def create
          @prompt_template_variable = PromptTemplateVariable.new(prompt_template_variable_params)

          if @prompt_template_variable.save
            redirect_to new_research_gen_ai_trial_path
          else
            render :new
          end
        end

        def show = @prompt_template_variable = PromptTemplateVariable.find(params[:id])

        private def prompt_template_variable_params
          params
            .require(:research_gen_ai_prompt_template_variable)
            .permit(:name, :value)
        end
      end
    end
  end
end
