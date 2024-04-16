# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class CalculateResultsWorker
        include Evidence.sidekiq_module

        sidekiq_options retry: 3, queue: 'gen_ai_eval'

        def perform(experiment_id)
          return if ENV.fetch('STOP_ALL_GEN_AI_EXPERIMENTS', 'false') == 'true'

          experiment = Experiment.find(experiment_id)
          results = (experiment.results || {}).merge(ResultsFetcher.run(experiment.llm_feedbacks))
          experiment.update!(results:)
        end
      end
    end
  end
end
