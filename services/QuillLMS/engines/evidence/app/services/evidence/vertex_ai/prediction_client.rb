# frozen_string_literal: true

module Evidence
  module VertexAI
    class PredictionClient < Client
      SERVICE_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::PredictionService::Client
      PREDICT_API_TIMEOUT = 5.0

      def predict_label_and_score(endpoint_external_id:, text:)
        service_client { |config| config.timeout = PREDICT_API_TIMEOUT }
          .predict(
            endpoint: endpoint(endpoint_external_id:),
            instances: instances(text:)
          )
      end

      private def endpoint(endpoint_external_id:)
        "projects/#{project_id}/locations/#{VERTEX_AI_LOCATION}/endpoints/#{endpoint_external_id}"
      end

      private def instances(text:)
        [::Google::Protobuf::Value.new(struct_value: { fields: { content: { string_value: text } } })]
      end
    end
  end
end
