# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  experiment_errors :text             default([]), not null, is an Array
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

        validates :llm_config_id, :llm_prompt_id, :passage_prompt_id, presence: true
        validates :status, presence: true, inclusion: { in: STATUSES }

        delegate :conjunction, :name, to: :passage_prompt
        delegate :llm_client, to: :llm_config
        delegate :vendor, :version, to: :llm_config

        attr_accessor :llm_prompt_template_id

        def run
          return unless status == PENDING

          update!(status: RUNNING)
          create_llm_prompt_responses_feedbacks
          update!(status: COMPLETED)
        rescue StandardError => e
          experiment_errors << e.message
          update!(status: FAILED)
        end

        private def create_llm_prompt_responses_feedbacks
          passage_prompt_responses.each do |passage_prompt_response|
            feedback = llm_client.run(prompt: llm_prompt.feedback_prompt(passage_prompt_response.response))
            LLMPromptResponseFeedback.create!(feedback:, passage_prompt_response:)
          end
        end
      end
    end
  end
end