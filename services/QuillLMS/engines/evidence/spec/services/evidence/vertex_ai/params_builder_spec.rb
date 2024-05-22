# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe ParamsBuilder do
      subject { described_class.run(name) }

      let(:name) { 'name' }

      let(:endpoint_external_id) { 'endpoint_external_id' }
      let(:endpoint_name) { "/projects/project_id/locations/location_id/endpoints/#{endpoint_external_id}" }
      let(:endpoint) { double('endpoint', display_name: name, name: endpoint_name, deployed_models: deployed_models) }
      let(:endpoint_client) { double('EndpointClient', list_endpoints: list_endpoints) }
      let(:deployed_models) { [model] }
      let(:list_endpoints) { [endpoint] }

      let(:model_external_id) { 'model_external_id' }
      let(:model_name) { "/projects/project_id/locations/location_id/models/#{model_external_id}" }
      let(:model) { double('model', display_name: name, model: model_name) }
      let(:model_client) { double('ModelClient', list_model_evaluations: [model_evaluation]) }

      let(:model_evaluation) do
        {
          metrics: {
            struct_value: {
              fields: {
                described_class::CONFUSION_MATRIX => {
                  struct_value: {
                    fields: {
                      described_class::ANNOTATION_SPECS => {
                        list_value: {
                          values: [
                            {
                              struct_value: {
                                fields: {
                                  described_class::DISPLAY_NAME => {
                                    string_value: label1
                                  }
                                }
                              }
                            },
                            {
                              struct_value: {
                                fields: {
                                  described_class::DISPLAY_NAME => {
                                    string_value: label2
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      end

      let(:label1) { 'label1' }
      let(:label2) { 'label2' }

      before do
        allow(::Google::Cloud::AIPlatform::V1::EndpointService::Client).to receive(:new).and_return(endpoint_client)
        allow(::Google::Cloud::AIPlatform::V1::ModelService::Client).to receive(:new).and_return(model_client)
      end

      context 'when name, endpoint, and model are present' do
        before { allow(endpoint).to receive(:deployed_models).and_return([model]) }

        it { expect(subject[:endpoint_external_id]).to eq endpoint_external_id }
        it { expect(subject[:model_external_id]).to eq model_external_id }
        it { expect(subject[:labels]).to eq [label1, label2] }
      end

      context 'when name is not present' do
        let(:name) { nil }

        it { is_expected.to eq({}) }
      end

      context 'when endpoint is not present' do
        let(:list_endpoints) { [] }

        it { is_expected.to eq({}) }
      end

      context 'when model is not present' do
        let(:deployed_models) { [] }

        it { is_expected.to eq({}) }
      end
    end
  end
end
