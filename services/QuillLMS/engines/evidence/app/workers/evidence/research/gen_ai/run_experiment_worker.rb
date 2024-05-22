# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class RunExperimentWorker
        include Evidence.sidekiq_module
        sidekiq_options retry: 0, queue: 'experiment'

        def perform(experiment_id)
          return if ENV.fetch('STOP_ALL_GEN_AI_EXPERIMENTS', 'false') == 'true'

          Experiment.find(experiment_id).run
        end
      end
    end
  end
end
