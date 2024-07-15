# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptTemplatesController < ApplicationController
        NEW_PERMITTED_PARAMS = %i[contents name notes]
        EDIT_PERMITTED_PARAMS = %i[notes]

        def index = @llm_prompt_templates = LLMPromptTemplate.all.order(id: :desc)

        def new
          @llm_prompt_template = LLMPromptTemplate.new
          @prompt_template_variables = PromptTemplateVariable.all.order(:name)
        end

        def create
          @llm_prompt_template = LLMPromptTemplate.new(llm_prompt_template_params(NEW_PERMITTED_PARAMS))

          if @llm_prompt_template.save
            redirect_to @llm_prompt_template
          else
            render :new
          end
        end

        def show
          @colored_contents = ColoredContentsBuilder.run(contents: llm_prompt_template.contents)
          @previewed_contents = PreviewedContentsBuilder.run(colored_contents: @colored_contents, llm_prompt_template:)
        end

        def edit = llm_prompt_template

        def update
          if llm_prompt_template.update(llm_prompt_template_params(EDIT_PERMITTED_PARAMS))
            redirect_to llm_prompt_template
          else
            render :edit
          end
        end

        private def llm_prompt_template = @llm_prompt_template ||= LLMPromptTemplate.find(params[:id])

        private def llm_prompt_template_params(permitted_params)
          params
            .require(:research_gen_ai_llm_prompt_template)
            .permit(permitted_params)
        end
      end
    end
  end
end
