# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe ParamsBuilder do
      subject { described_class.run(name:, project:) }

      let(:name) { 'name' }
      let(:project) { VERTEX_AI_PROJECTS.first }

      let(:endpoint_client_class) { EndpointClient }
      let(:endpoint_client) { instance_double(endpoint_client_class) }
      let(:endpoint_external_id) { 'endpoint_external_id' }
      let(:endpoint_name) { "/projects/project_id/locations/location_id/endpoints/#{endpoint_external_id}" }
      let(:endpoint) { double('endpoint', deployed_models:, name: endpoint_name) }

      let(:model) { double('model', display_name: name, model: model_name) }
      let(:model_name) { "/projects/project_id/locations/location_id/models/#{model_external_id}" }
      let(:model_external_id) { 'model_external_id' }
      let(:model_client_class) { ModelClient }
      let(:model_client) { instance_double(model_client_class) }

      let(:deployed_models) { [model] }
      let(:deployed_model) { model }

      let(:label1) { 'label1' }
      let(:label2) { 'label2' }

      before do
        allow(EndpointClient).to receive(:new).and_return(endpoint_client)
        allow(endpoint_client).to receive(:find_endpoint).with(name:).and_return(endpoint)

        allow(ModelClient).to receive(:new).and_return(model_client)
        allow(model_client).to receive(:list_labels).with(deployed_model:).and_return([label1, label2])
      end

      context 'when name, endpoint, and model are present' do
        it { expect(subject[:endpoint_external_id]).to eq endpoint_external_id }
        it { expect(subject[:model_external_id]).to eq model_external_id }
        it { expect(subject[:labels]).to eq [label1, label2] }
      end

      context 'when name is not present' do
        let(:name) { nil }

        it { is_expected.to eq({}) }
      end

      context 'when endpoint is not present' do
        let(:endpoint) { nil }

        it { is_expected.to eq({}) }
      end

      context 'when model is not present' do
        let(:deployed_models) { [] }

        it { is_expected.to eq({}) }
      end
    end
  end
end
