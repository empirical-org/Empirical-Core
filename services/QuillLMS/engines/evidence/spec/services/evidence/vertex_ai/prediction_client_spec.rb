# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe PredictionClient do
      let(:project) { VERTEX_AI_PROJECTS.first }
      let(:project_id) { 'project_id' }
      let(:credentials_hash) { { 'project_id' => project_id } }
      let(:credentials) { credentials_hash.to_json }
      let(:prediction_service_class) { described_class::SERVICE_CLIENT_CLASS }
      let(:prediction_service_instance) { instance_double(prediction_service_class) }
      let(:text) { "sample text" }
      let(:endpoint_external_id) { "endpoint_external_id" }
      let(:config_struct) { Struct.new(:credentials, :timeout).new(credentials_hash, described_class::PREDICT_API_TIMEOUT) }

      before do
        allow(prediction_service_class)
          .to receive(:new)
          .and_yield(config_struct)
          .and_return(prediction_service_instance)
      end

      describe '#predict_label_and_score' do
        subject { described_class.new(project:).predict_label_and_score(endpoint_external_id:, text:) }

        let(:predicted_response) { double("PredictedResponse") }

        before { allow(prediction_service_instance).to receive(:predict).and_return(predicted_response) }

        it 'calls the PredictionService with correct parameters' do
          expect(prediction_service_instance).to receive(:predict) do |params|
            expect(params[:endpoint]).to eq("projects/#{project_id}/locations/#{VERTEX_AI_LOCATION}/endpoints/#{endpoint_external_id}")
            expect(params[:instances].first).to be_a(::Google::Protobuf::Value)
            expect(params[:instances].first.struct_value.fields['content'].string_value).to eq(text)
          end.and_return(predicted_response)

          subject
        end

        it { is_expected.to eq predicted_response }
      end
    end
  end
end
