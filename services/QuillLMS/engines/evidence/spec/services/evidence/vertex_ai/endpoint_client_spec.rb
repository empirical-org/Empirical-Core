# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe EndpointClient do
      let(:project) { VERTEX_AI_PROJECTS.first }

      let(:service_client_class) { described_class::SERVICE_CLIENT_CLASS }
      let(:service_client_instance) { instance_double(service_client_class, list_endpoints:) }

      let(:name1) { 'Good Model' }
      let(:name2) { 'Better Model' }
      let(:name3) { 'Best Model' }

      let(:endpoint1) { double(display_name: name1, deployed_models: [double(display_name: name1)]) }
      let(:endpoint2) { double(display_name: name2, deployed_models: [double(display_name: name3)]) }
      let(:endpoint3) { double(display_name: name3, deployed_models: [double(display_name: name3)]) }

      describe '#list_model_names_and_projects' do
        subject { described_class.new(project:).list_model_names_and_projects }

        before { allow(service_client_class).to receive(:new).and_return(service_client_instance) }

        context 'matching deployed models found' do
          let(:list_endpoints) { [endpoint1, endpoint2, endpoint3] }

          it { is_expected.to eq ["#{name1},#{project}", "#{name3},#{project}"] }
        end

        context 'no matching deployed models found' do
          let(:list_endpoints) { [endpoint2] }

          it { is_expected.to eq [] }
        end
      end

      describe '#find_endpoint' do
        subject { described_class.new(project:).find_endpoint(name:) }

        let(:name) { name1 }

        before { allow(service_client_class).to receive(:new).and_return(service_client_instance) }

        context 'endpoint with the name exists' do
          let(:list_endpoints) { [endpoint1] }

          before { allow(service_client_class).to receive(:new).and_return(service_client_instance) }

          it { is_expected.to eq endpoint1 }
        end

        context 'endpoint with the name does not exist' do
          let(:list_endpoints) { [endpoint2] }

          it { is_expected.to be_nil }
        end
      end
    end
  end
end
