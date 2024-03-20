# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      include Evidence.sidekiq_module
      sidekiq_options retry: 0

      def perform(experiment_id)
        Experiment.find(experiment_id).run
      end
    end
  end
end
