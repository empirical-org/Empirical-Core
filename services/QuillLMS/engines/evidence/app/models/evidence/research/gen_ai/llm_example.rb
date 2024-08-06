# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_examples
#
#  id                  :bigint           not null, primary key
#  label               :string
#  llm_assigned_status :string           not null
#  llm_feedback        :text             not null
#  raw_text            :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  test_example_id     :integer          not null
#  trial_id            :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMExample < ApplicationRecord
        include HasAssignedStatus

        belongs_to :trial
        belongs_to :test_example

        validates :raw_text, presence: true
        validates :llm_feedback, presence: true
        validates :test_example_id, presence: true
        validates :trial_id, presence: true
        validates :llm_assigned_status, presence: true

        attr_readonly :trial_id, :label, :test_example_id, :raw_text, :llm_feedback, :llm_assigned_status

        delegate :curriculum_proposed_feedback, :student_response, to: :test_example

        def self.assigned_status_column = :llm_assigned_status

        def response_and_feedback = { student_response:, feedback: llm_feedback, optimal: optimal? }

        def optimal_or_suboptimal_match? = optimal_match? || suboptimal_match?
        def optimal_match? = test_optimal? && optimal?
        def suboptimal_match? = test_suboptimal? && suboptimal?
        def test_optimal? = test_example.optimal?
        def test_suboptimal? = test_example.suboptimal?
      end
    end
  end
end
