# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class RunExperimentWorker
        include Evidence.sidekiq_module
        sidekiq_options retry: 0, queue: 'experiment'

        def perform(experiment_id, limit_num_examples = nil)
          Experiment.find(experiment_id).run(limit_num_examples:)
        end
      end
    end
  end
end
