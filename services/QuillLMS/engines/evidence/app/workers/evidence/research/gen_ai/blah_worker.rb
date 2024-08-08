# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class BlahWorker
        include Evidence.sidekiq_module

        def perform(trial_id, test_example_id)
          trial = Trial.find(trial_id)
          test_example = trial.test_examples.find(test_example_id)

          api_call_start_time = Time.zone.now
          prompt = trial.llm_prompt.prompt_with_student_response(test_example.student_response)
          raw_text = trial.llm.completion(prompt)
          api_call_time = Time.zone.now - api_call_start_time

          llm_feedback = LLMFeedbackResolver.run(raw_text:)
          llm_assigned_status = LLMAssignedStatusResolver.run(raw_text:)

          LLMExample.create!(trial:, raw_text:, llm_feedback:, test_example:, llm_assigned_status:)

          trial.update_results(api_call_times: trial.results.fetch('api_call_times', []) << api_call_time.round(2))
        rescue => e
          trial.trial_errors << { error: e.message, test_example_id: test_example.id, raw_text: raw_text }.to_json
          trial.save!
        end
      end
    end
  end
end
