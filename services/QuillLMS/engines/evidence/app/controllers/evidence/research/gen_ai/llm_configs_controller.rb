# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMConfigsController < ApplicationController
        def new
          @llm_config = LLMConfig.new
        end

        def create
          @llm_config = LLMConfig.new(llm_config_params)

          if @llm_config.save
            redirect_to research_gen_ai_experiments_path
          else
            render :new
          end
        end

        def show = @llm_config = LLMConfig.find(params[:id])

        private def llm_config_params
          params
            .require(:research_gen_ai_llm_config)
            .permit(:vendor, :version)
        end
      end
    end
  end
end
