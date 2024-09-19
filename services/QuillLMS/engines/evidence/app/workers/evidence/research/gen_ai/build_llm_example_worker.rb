# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class BuildLLMExampleWorker
        include Evidence.sidekiq_module
        sidekiq_options queue: 'default'

        class TrialNotFoundError < StandardError; end

        def perform(trial_id, test_example_id)
          trial = find_trial(trial_id)
          test_example = trial.test_examples.find(test_example_id)
          api_call_start_time = Time.zone.now
          prompt = trial.llm_prompt.prompt_with_student_response(test_example.student_response)
          raw_text = trial.llm.completion(prompt, trial.temperature)
          api_call_time = Time.zone.now - api_call_start_time
          llm_feedback = LLMFeedbackResolver.run(raw_text:)
          llm_assigned_status = llm_feedback&.start_with?('Optimal') ? 'optimal' : 'suboptimal'
          LLMExample.create!(trial:, raw_text:, llm_feedback:, test_example:, llm_assigned_status:)
          trial.update_results!(api_call_times: trial.results.fetch('api_call_times', []) << api_call_time.round(2))
        rescue TrialNotFoundError => e
          raise e
          # trial.trial_errors.add({ error: e.message, test_example_id: test_example&.id, raw_text: raw_text }.to_json)
          # trial.save!
        end

        private def find_trial(trial_id)
          Trial.find(trial_id)
        rescue ActiveRecord::RecordNotFound
          raise TrialNotFoundError, "Trial with id #{trial_id} not found"
        end
      end
    end
  end
end
