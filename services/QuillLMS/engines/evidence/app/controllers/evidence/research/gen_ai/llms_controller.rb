# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMsController < ApplicationController
        def new
          @llm = LLM.new
        end

        def create
          @llm = LLM.new(llm_params)

          if @llm.save
            redirect_to new_research_gen_ai_trial_path
          else
            render :new
          end
        end

        def show = @llm = LLM.find(params[:id])

        private def llm_params
          params
            .require(:research_gen_ai_llm)
            .permit(:vendor, :version)
        end
      end
    end
  end
end
