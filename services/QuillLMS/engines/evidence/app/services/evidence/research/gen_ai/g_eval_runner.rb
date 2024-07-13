# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GEvalRunner < ApplicationService
        attr_reader :g_eval_id, :llm_example

        def initialize(g_eval_id:, llm_example:)
          @g_eval_id = g_eval_id
          @llm_example = llm_example
        end

        def run = JSON.parse(g_eval_output)[g_eval.metric]

        private def g_eval_output = llm.completion(prompt).strip

        private def llm = LLM.g_eval

        private def g_eval = @g_eval ||= GEval.find(g_eval_id)

        private def student_response = test_example.student_response

        private def stem = test_example.dataset.stem_vault.stem

        private def ideal_feedback = test_example.curriculum_proposed_feedback

        private def test_example = @test_example ||= llm_example.test_example

        private def prompt
          "
          Task Introduction:
          #{g_eval.task_introduction}

          Evaluation Criteria:
          #{g_eval.evaluation_criteria}

          Evaluation Steps:
          #{g_eval.evaluation_steps}

          Example:
          Stem: #{stem}
          Student Response: #{student_response}
          LLM Feedback: #{llm_example.llm_feedback}
          Ideal Feedback: #{ideal_feedback}

          Evaluation Form (scores ONLY):
          - #{g_eval.metric}:
          "
        end
      end
    end
  end
end
