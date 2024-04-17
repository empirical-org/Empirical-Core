# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  experiment_errors :text             default([]), not null, is an Array
#  num_examples      :integer          default(0), not null
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

        belongs_to :llm_config
        belongs_to :llm_prompt
        belongs_to :passage_prompt

        has_many :llm_feedbacks
        has_many :passage_prompt_responses, through: :passage_prompt
        has_many :example_feedbacks, through: :passage_prompt_responses

        validates :llm_config_id, :llm_prompt_id, :passage_prompt_id, presence: true
        validates :status, presence: true, inclusion: { in: STATUSES }

        delegate :conjunction, :name, to: :passage_prompt
        delegate :llm_client, to: :llm_config
        delegate :vendor, :version, to: :llm_config

        attr_readonly :llm_config_id, :llm_prompt_id, :passage_prompt_id

        attr_accessor :llm_config_ids, :llm_prompt_template_ids, :passage_prompt_ids, :num_examples

        def run
          return unless status == PENDING

          update!(status: RUNNING)
          create_llm_prompt_responses_feedbacks
          CalculateResultsWorker.perform_async(id)
          update!(status: COMPLETED)
        rescue StandardError => e
          experiment_errors << e.message
          update!(status: FAILED)
        end

        private def create_llm_prompt_responses_feedbacks
          passage_prompt_responses.limit(num_examples).each do |passage_prompt_response|
            feedback = llm_client.run(llm_config:, prompt: llm_prompt.feedback_prompt(passage_prompt_response.response))
            LLMFeedback.create!(experiment: self, text: feedback, passage_prompt_response:)
          end
        end
      end
    end
  end
end
