# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptTemplatesController < ApplicationController
        def new
          @llm_prompt_template = LLMPromptTemplate.new
        end

        def create
          @llm_prompt_template = LLMPromptTemplate.new(llm_prompt_template_params)

          if @llm_prompt_template.save
            redirect_to new_research_gen_ai_experiment_path
          else
            render :new
          end
        end

        def show = @llm_prompt_template = LLMPromptTemplate.find(params[:id])

        private def llm_prompt_template_params
          params
            .require(:research_gen_ai_llm_prompt_template)
            .permit(:contents, :description)
        end
      end
    end
  end
end
