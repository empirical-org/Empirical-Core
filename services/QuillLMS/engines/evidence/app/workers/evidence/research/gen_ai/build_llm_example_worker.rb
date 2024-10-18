# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class BuildLLMExampleWorker
        include Evidence.sidekiq_module

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL

        sidekiq_options queue: 'default'

        class TrialNotFoundError < StandardError; end

        # rubocop:disable Metrics/CyclomaticComplexity
        def perform(trial_id, test_example_id)
          trial = Trial.find(trial_id)
          test_example = trial.test_examples.find(test_example_id)

          api_call_start_time = Time.zone.now
          student_response = test_example.student_response

          if trial.classification?
            prompt = trial.llm_prompt.prompt_with_rag_label_examples_and_student_response(
              entry: student_response,
              label: test_example.curriculum_label,
              prompt_id: trial.stem_vault.prompt_id
            )
          elsif trial.generative?
            prompt = trial.llm_prompt.prompt_with_student_response(student_response:)
          end

          raw_text = trial.llm.completion(prompt, trial.temperature)
          api_call_time = Time.zone.now - api_call_start_time

          llm_feedback = LLMFeedbackResolver.run(raw_text:)

          if trial.classification?
            llm_assigned_status = llm_feedback&.start_with?('Optimal') ? OPTIMAL : SUBOPTIMAL
          elsif trial.generative?
            llm_assigned_status = LLMAssignedStatusResolver.run(raw_text:)
          end

          LLMExample.create!(trial:, raw_text:, llm_feedback:, test_example:, llm_assigned_status:)

          trial.update_results!(api_call_times: trial.results.fetch('api_call_times', []) << api_call_time.round(2))
        rescue => e
          trial.trial_errors << { error: e.message, test_example_id: test_example.id, raw_text: raw_text }.to_json
          trial.save!
        end
        # rubocop:enable Metrics/CyclomaticComplexity
      end
    end
  end
end
