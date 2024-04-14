# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  experiment_duration :float
#  experiment_errors   :text             default([]), not null, is an Array
#  num_examples        :integer          default(0), not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  llm_config_id       :integer          not null
#  llm_prompt_id       :integer          not null
#  passage_prompt_id   :integer          not null
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

        has_many :llm_feedbacks, -> { order(:id) }
        has_many :passage_prompt_responses, -> { order(:id) }, through: :passage_prompt
        has_many :example_feedbacks, -> { order(:id) }, through: :passage_prompt_responses

        validates :llm_config_id, :llm_prompt_id, :passage_prompt_id, presence: true
        validates :status, presence: true, inclusion: { in: STATUSES }

        delegate :conjunction, :name, to: :passage_prompt
        delegate :llm_client, to: :llm_config
        delegate :vendor, :version, to: :llm_config
        delegate :llm_prompt_template_id, to: :llm_prompt

        scope :completed, -> { where(status: COMPLETED) }
        scope :failed, -> { where(status: FAILED) }

        attr_readonly :llm_config_id, :llm_prompt_id, :passage_prompt_id

        attr_accessor :llm_config_ids, :llm_prompt_template_ids, :passage_prompt_ids

        def pending? = status == PENDING
        def failed? = status == FAILED
        def running? = status == RUNNING

        def run
          start_time = Time.zone.now

          return unless pending?

          update!(status: RUNNING)
          create_llm_prompt_responses_feedbacks
          CalculateResultsWorker.perform_async(id)
          experiment_errors.empty? ? update!(status: COMPLETED) : update!(status: FAILED)
        rescue => e
          experiment_errors << e.message
          update!(status: FAILED)
        ensure
          update!(experiment_duration: Time.zone.now - start_time)
        end

        def update_results(new_data)
          self.results ||= {}
          results.merge!(new_data)
          save!
        end

        def retry_params = { llm_config_id:, llm_prompt_id:, passage_prompt_id:, num_examples: }

        private def create_llm_prompt_responses_feedbacks
          passage_prompt_responses.limit(num_examples).each do |passage_prompt_response|
            feedback = llm_client.run(llm_config:, prompt: llm_prompt.feedback_prompt(passage_prompt_response.response))
            text = Resolver.run(feedback:)
            LLMFeedback.create!(experiment: self, text:, passage_prompt_response:)
          rescue Resolver::Error => e
            experiment_errors << (e.message + " for response: #{passage_prompt_response.id}")
            next
          end
        end
      end
    end
  end
end
