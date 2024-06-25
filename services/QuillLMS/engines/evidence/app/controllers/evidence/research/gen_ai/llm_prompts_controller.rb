# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptsController < ApplicationController
        def show
          @llm_prompt = LLMPrompt.find(params[:id])
          @dataset = @llm_prompt.trial.dataset
        end
      end
    end
  end
end
