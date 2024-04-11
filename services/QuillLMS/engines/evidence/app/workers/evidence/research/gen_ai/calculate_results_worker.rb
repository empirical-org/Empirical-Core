# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class CalculateResultsWorker
        include Evidence.sidekiq_module

        sidekiq_options retry: 3, queue: 'gen_ai_eval'

        def perform(experiment_id)
          start_time = Time.zone.now

          return if ENV.fetch('STOP_ALL_GEN_AI_EXPERIMENTS', 'false') == 'true'

          experiment = Experiment.find(experiment_id)
          experiment.update_results(ResultsFetcher.run(experiment.llm_feedbacks))
        ensure
          experiment.update_results(evaluation_duration: (Time.zone.now - start_time).round(2))
        end
      end
    end
  end
end
