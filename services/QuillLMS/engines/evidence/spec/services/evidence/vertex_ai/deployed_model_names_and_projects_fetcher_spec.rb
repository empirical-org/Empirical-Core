# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe DeployedModelNamesAndProjectsFetcher do
      subject { described_class.run }

      let(:vertex_ai_project_id) { 'your_project_id' }
      let(:vertex_ai_location) { 'your_location' }
      let(:client_class) { described_class::ENDPOINT_CLIENT_CLASS }
      let(:client_instance) { instance_double(client_class, list_endpoints:) }

      let(:name1) { 'Good Model' }
      let(:name2) { 'Better Model' }
      let(:name3) { 'Best Model' }

      let(:endpoint1) { double(display_name: name1, deployed_models: [double(display_name: name1)]) }
      let(:endpoint2) { double(display_name: name2, deployed_models: [double(display_name: name3)]) }
      let(:endpoint3) { double(display_name: name3, deployed_models: [double(display_name: name3)]) }

      before do
        create(:evidence_automl_model, project: vertex_ai_project_id)
        stub_const('VERTEX_AI_LOCATION', vertex_ai_location)
        allow(client_class).to receive(:new).and_return(client_instance)
      end

      context 'matching deployed models found' do
        let(:list_endpoints) { [endpoint1, endpoint2, endpoint3] }

        it { is_expected.to eq [{name3 => vertex_ai_project_id}, {name1 => vertex_ai_project_id}] }
      end

      context 'no matching deployed models found' do
        let(:list_endpoints) { [endpoint2] }

        it { is_expected.to eq [] }
      end
    end
  end
end
