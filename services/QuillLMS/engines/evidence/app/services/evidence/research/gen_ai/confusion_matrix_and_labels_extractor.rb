# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ConfusionMatrixAndLabelsExtractor < ApplicationService
        attr_reader :prompt_id

        def initialize(prompt_id:)
          @prompt_id = prompt_id
        end

        def run = { confusion_matrix:, labels: }

        private def automl_model = @automl_model ||= Evidence::AutomlModel.where(prompt_id:).last
        private def confusion_matrix = model_evaluation['metrics']['confusionMatrix']['rows']
        private def labels = model_evaluation['metrics']['confusionMatrix']['annotationSpecs'].pluck('displayName')
        private def project = automl_model.project
        private def model_client = Evidence::VertexAI::ModelClient.new(project:)
        private def model_external_id = automl_model.model_external_id
        private def model_evaluation = JSON.parse(model_client.get_last_model_evaluation(model_external_id:).to_json)
      end
    end
  end
end
