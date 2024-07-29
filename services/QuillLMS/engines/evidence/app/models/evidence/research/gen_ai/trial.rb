# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  results             :jsonb
#  status              :string           default("pending"), not null
#  trial_duration      :float
#  trial_errors        :text             default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  dataset_id          :integer          not null
#  llm_id              :integer          not null
#  llm_prompt_id       :integer          not null
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
        belongs_to :dataset

        has_many :llm_examples, -> { order(:id) }
        has_many :test_examples, -> { order(:id) }, through: :dataset

        validates :llm_id, :llm_prompt_id, :dataset_id, presence: true
        validates :status, presence: true, inclusion: { in: STATUSES }

        delegate :stem_vault, to: :dataset
        delegate :conjunction, :name, to: :stem_vault
        delegate :vendor, :version, to: :llm
        delegate :llm_prompt_template_id, to: :llm_prompt
        delegate :test_examples_count, :optimal_count, :suboptimal_count, to: :dataset

        scope :completed, -> { where(status: COMPLETED) }
        scope :failed, -> { where(status: FAILED) }

        store_accessor :results,
          :api_call_times,
          :confusion_matrix,
          :g_eval_ids,
          :g_evals

        attr_readonly :llm_id, :llm_prompt_id, :dataset_id

        attr_accessor :guideline_ids, :llm_prompt_template_id, :prompt_example_ids, :g_eval_id

        def pending? = status == PENDING
        def failed? = status == FAILED
        def running? = status == RUNNING
        def completed? = status == COMPLETED

        def optimal_correct = confusion_matrix ? confusion_matrix[0][0] : 0
        def suboptimal_correct = confusion_matrix ? confusion_matrix[1][1] : 0

        def average_g_eval_score
          scores = g_evals&.values&.flatten&.compact&.map(&:to_i)
          return 0 if scores.blank?

          (1.0 * scores.sum / scores.size).round(2)
        end

        def run
          start_time = Time.zone.now

          return unless pending?

          update!(status: RUNNING)
          query_llm
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

        def retry_params = { llm_id:, llm_prompt_id:, dataset_id: }

        private def query_llm
          [].tap do |api_call_times|
            test_examples.each do |test_example|
              api_call_start_time = Time.zone.now
              prompt = llm_prompt.prompt_with_student_response(test_example.student_response)
              raw_text = llm.completion(prompt)
              api_call_times << (Time.zone.now - api_call_start_time).round(2)

              llm_feedback = LLMFeedbackResolver.run(raw_text:)
              llm_assigned_status = LLMAssignedStatusResolver.run(raw_text:)

              LLMExample.create!(trial: self, raw_text:, llm_feedback:, test_example:, llm_assigned_status:)
            rescue => e
              trial_errors << { error: e.message, test_example_id: test_example.id, raw_text: }.to_json
              next
            end
            update_results(api_call_times:)
          end
        end
      end
    end
  end
end
