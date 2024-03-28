# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptsController < ApplicationController
        def show = @llm_prompt = LLMPrompt.find(params[:id])
      end
    end
  end
end
