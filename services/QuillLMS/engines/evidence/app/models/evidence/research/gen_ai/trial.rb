# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  number              :integer          not null
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
          :g_evals,
          :trial_start_time,
          :evaluation_start_time

        attr_readonly :llm_id, :llm_prompt_id, :dataset_id

        attr_accessor :guideline_ids, :llm_prompt_template_id, :prompt_example_ids, :g_eval_id

        before_create :set_trial_number

        def pending? = status == PENDING
        def failed? = status == FAILED
        def running? = status == RUNNING
        def completed? = status == COMPLETED

        def optimal_correct = confusion_matrix ? confusion_matrix[0][0] : 0
        def suboptimal_correct = confusion_matrix ? confusion_matrix[1][1] : 0

        def average_g_eval_score
          return 0 if scores.blank?

          (1.0 * scores.sum / scores.size).round(2)
        end

        def scores = g_evals&.values&.flatten&.compact&.map(&:to_f)

        def run
          return unless pending?

          update!(trial_start_time: Time.zone.now)
          update!(status: RUNNING)

          batch = Sidekiq::Batch.new
          batch.on(:complete, self.class, trial_id: id)

          batch.jobs do
            test_examples.each do |test_example|
              BuildLLMExampleWorker.perform_async(id, test_example.id)
            end
          end
        rescue => e
          trial_errors << e.message
          update!(status: FAILED)
        end

        def update_results!(new_data)
          self.results ||= {}
          results.merge!(new_data)
          save!
        end

        def retry_params = { llm_id:, llm_prompt_id:, dataset_id: }

        private def set_trial_number
          last_trial_number = self.class.where(dataset_id:).maximum(:number) || 0
          self.number = last_trial_number + 1
        end

        private def on_complete(_status, options)
          trial = Trial.find(options['trial_id'])
          trial.update!(trial_duration: Time.zone.now - Time.zone.parse(trial.trial_start_time))
          CalculateResultsWorker.perform_async(options['trial_id'])
          trial.trial_errors.empty? ? trial.update!(status: COMPLETED) : trial.update!(status: FAILED)
        end
      end
    end
  end
end
