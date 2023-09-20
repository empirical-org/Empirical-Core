# frozen_string_literal: true

module Evidence
  class BlahClient
  end
end

private def model_client
  @model_client ||= ::Google::Cloud::AIPlatform::V1::ModelService::Client.new
end

private def model_endpoint
  @model_endpoint ||= model_client.model_path(**model_endpoint_args)
end

ANNOTATION_SPECS = 'annotationSpecs'
DISPLAY_NAME = 'displayName'
CONFUSION_MATRIX = 'confusionMatrix'

private def pull_labels
  model_client
    .list_model_evaluations(parent: model_endpoint)
    .first
    .to_h
    .dig(:metrics, :struct_value, :fields, CONFUSION_MATRIX, :struct_value, :fields, ANNOTATION_SPECS, :list_value, :values)
    .map { |v| v.dig(:struct_value, :fields, DISPLAY_NAME, :string_value) }
    .flatten
    .reject(&:empty?)
    .uniq
end

private def pull_name
  model_client
    .get_model(name: model_endpoint)
    .display_name
end

private def model_endpoint_args
  {project: AI_PLATFORM_PROJECT_ID, location: AI_PLATFORM_LOCATION, model: model_external_id.strip}
end
