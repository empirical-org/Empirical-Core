# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_trials
#
#  id                  :bigint           not null, primary key
#  evaluation_duration :float
#  notes               :text
#  number              :integer          not null
#  results             :jsonb
#  status              :string           default("pending"), not null
#  temperature         :float            not null
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
        validates :temperature, presence: true

        delegate :stem_vault, to: :dataset
        delegate :conjunction, :name, to: :stem_vault
        delegate :vendor, :version, to: :llm
        delegate :llm_prompt_template_id, to: :llm_prompt
        delegate :test_examples_count, :optimal_count, :suboptimal_count, to: :dataset
        delegate :classification?, :generative?, to: :dataset

        scope :completed, -> { where(status: COMPLETED) }
        scope :failed, -> { where(status: FAILED) }

        store_accessor :results,
          :api_call_times,
          :confusion_matrix,
          :g_eval_ids,
          :g_evals,
          :trial_start_time,
          :evaluation_start_time,
          :labels

        attr_readonly :llm_id, :llm_prompt_id, :dataset_id, :temperature

        attr_accessor :guideline_ids, :llm_prompt_template_id, :prompt_example_ids, :g_eval_id

        before_create :set_trial_number

        def pending? = status == PENDING
        def failed? = status == FAILED
        def running? = status == RUNNING
        def completed? = status == COMPLETED

        def pending! = update!(status: PENDING)
        def failed! = update!(status: FAILED)
        def running! = update!(status: RUNNING)
        def completed! = update!(status: COMPLETED)

        def run = TrialRunner.run(self)

        def optimal_correct = confusion_matrix ? confusion_matrix.try(:[], 0).try(:[], 0) : 0
        def suboptimal_correct = confusion_matrix ? confusion_matrix.try(:[], 1).try(:[], 1) : 0

        def average_g_eval_score = scores.blank? ? 0 : (1.0 * scores.sum / scores.size).round(2)
        def scores = g_evals&.values&.flatten&.compact&.map(&:to_f)

        def update_results!(new_data)
          self.results ||= {}
          results.merge!(new_data)
          save!
        end

        def set_labels
          update_results!(labels: (llm_examples.map(&:rag_label) + llm_examples.map { |e| e.test_example.rag_label }).uniq.sort)
        end

        def set_confusion_matrix
          if classification?
            update_results!(confusion_matrix: ClassificationConfusionMatrixBuilder.run(llm_examples:, labels:))
          elsif generative?
            update_results!(confusion_matrix: GenerativeConfusionMatrixBuilder.run(llm_examples:))
          end
        end

        def set_evaluation_duration = update!(evaluation_duration: Time.zone.now - Time.zone.parse(evaluation_start_time))
        def set_evaluation_start_time = update!(evaluation_start_time: Time.zone.now)
        def set_trial_start_time = update!(trial_start_time: Time.zone.now)
        def set_trial_duration = update!(trial_duration: Time.zone.now - Time.zone.parse(trial_start_time))
        def set_status = trial_errors.empty? ? completed! : failed!

        private def set_trial_number
          last_trial_number = self.class.where(dataset_id:).maximum(:number) || 0
          self.number = last_trial_number + 1
        end
      end
    end
  end
end
