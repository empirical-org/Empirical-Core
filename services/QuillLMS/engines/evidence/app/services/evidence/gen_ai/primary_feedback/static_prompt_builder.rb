# frozen_string_literal: true

module Evidence
  module GenAI
    module PrimaryFeedback
      class StaticPromptBuilder < ApplicationService
        PROMPT_FOLDER = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/primary_feedback/static_prompts/"

        attr_reader :prompt_id

        def initialize(prompt_id)
          @prompt_id = prompt_id
        end

        def run = static_prompt_exists? ? static_prompt : nil

        private def file_path = File.join(PROMPT_FOLDER, "#{prompt_id}.md")
        private def static_prompt_exists? = File.exist?(file_path)
        private def static_prompt = File.read(file_path)
      end
    end
  end
end
