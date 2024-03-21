# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  experiment_errors :text             is an Array
#  results           :jsonb
#  status            :string           default("pending"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  llm_config_id     :integer          not null
#  llm_prompt_id     :integer          not null
#  passage_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Experiment < ApplicationRecord
        STATUSES = [
          PENDING = 'pending',
          RUNNING = 'running',
          COMPLETED = 'completed',
          FAILED = 'failed'
        ].freeze

        belongs_to :llm_config, class_name: 'Evidence::Research::GenAI::LLMConfig'
        belongs_to :llm_prompt, class_name: 'Evidence::Research::GenAI::LLMPrompt'
        belongs_to :passage_prompt, class_name: 'Evidence::Research::GenAI::PassagePrompt'

        has_many :passage_prompt_responses,
          class_name: 'Evidence::Research::GenAI::PassagePromptResponse',
          through: :passage_prompt

        validates :status, presence: true, inclusion: { in: STATUSES }

        delegate :llm_client, to: :llm_config

        def completed! = update!(status: COMPLETED)
        def running! = update!(status: RUNNING)
        def failed! = update!(status: FAILED)

        def run
          running!
          create_llm_prompt_responses_feedbacks
          completed!
        rescue StandardError => e
          experiment_errors << e.message
          failed!
        end

        # TODO: limit should be abstracted out for real experiments
        private def create_llm_prompt_responses_feedbacks
          passage_prompt_responses.limit(3).each do |passage_prompt_response|
            LLMPromptResponseFeedback.save_llm_feedback!(passage_prompt_response:, llm_prompt:, llm_client:)
          end
        end
      end
    end
  end
end
