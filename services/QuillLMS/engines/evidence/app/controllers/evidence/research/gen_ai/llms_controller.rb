# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMsController < ApplicationController
        def index = @llms = LLM.order(:order)

        def new
          @llm = LLM.new
        end

        def create
          @llm = LLM.new(llm_create_params)

          @llm.save ? redirect_to(@llm) : render(:new)
        end

        def update
          @llm = LLM.find(params[:id])
          @llm.update(llm_update_params)
          redirect_to research_gen_ai_llms_path
        end

        def show = @llm = LLM.find(params[:id])

        private def llm_create_params
          params
            .require(:research_gen_ai_llm)
            .permit(:vendor, :version)
        end

        private def llm_update_params
          params
            .require(:research_gen_ai_llm)
            .permit(:order)
        end
      end
    end
  end
end
