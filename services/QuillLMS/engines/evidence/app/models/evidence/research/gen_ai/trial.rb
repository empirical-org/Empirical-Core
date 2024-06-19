# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  num_examples        :integer
#  results             :jsonb
#  status              :string           default("pending"), not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  llm_id              :integer          not null
#  llm_prompt_id       :integer          not null
#  stem_vault_id       :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Trial < ApplicationRecord
        STATUSES = [
          PENDING = 'pending',
          RUNNING = 'running',
          COMPLETED = 'completed',
          FAILED = 'failed'
        ].freeze

        belongs_to :llm
        belongs_to :llm_prompt
        belongs_to :stem_vault

        has_many :llm_feedbacks, -> { order(:id) }
        has_many :student_responses, -> { order(:id) }, through: :stem_vault
        has_many :quill_feedbacks, -> { order(:id) }, through: :student_responses

        validates :llm_id, :llm_prompt_id, :stem_vault_id, presence: true
        validates :status, presence: true, inclusion: { in: STATUSES }

        delegate :conjunction, :name, to: :stem_vault
        delegate :vendor, :version, to: :llm
        delegate :llm_prompt_template_id, to: :llm_prompt

        scope :completed, -> { where(status: COMPLETED) }
        scope :failed, -> { where(status: FAILED) }

        store_accessor :results,
          :api_call_times,
          :accuracy_identical,
          :accuracy_optimal_sub_optimal,
          :confusion_matrix,
          :g_eval_ids,
          :g_evals

        attr_readonly :llm_id, :llm_prompt_id, :stem_vault_id

        attr_accessor :llm_ids, :llm_prompt_template_ids, :stem_vault_ids

        def pending? = status == PENDING
        def failed? = status == FAILED
        def running? = status == RUNNING

        def run
          start_time = Time.zone.now

          return unless pending?

          update!(status: RUNNING)
          create_llm_prompt_responses_feedbacks
          CalculateResultsWorker.perform_async(id)
          trial_errors.empty? ? update!(status: COMPLETED) : update!(status: FAILED)
        rescue => e
          trial_errors << e.message
          update!(status: FAILED)
        ensure
          update!(trial_duration: Time.zone.now - start_time)
        end

        def update_results(new_data)
          self.results ||= {}
          results.merge!(new_data)
          save!
        end

        def retry_params = { llm_id:, llm_prompt_id:, stem_vault_id:, num_examples: }

        private def create_llm_prompt_responses_feedbacks
          [].tap do |api_call_times|
            student_responses.testing_data.limit(num_examples).each do |student_response|
              api_call_start_time = Time.zone.now
              raw_text = llm.completion(prompt: llm_prompt.feedback_prompt(student_response.text))
              api_call_times << (Time.zone.now - api_call_start_time).round(2)

              text = Resolver.run(raw_text:)
              LLMFeedback.create!(trial: self, raw_text:, text:, student_response:)
            rescue => e
              trial_errors << { error: e.message, student_response_id: student_response.id, raw_text: }.to_json
              next
            end
            update_results(api_call_times:)
          end
        end
      end
    end
  end
end
