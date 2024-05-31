# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe ModelClient do
      describe '#list_labels' do
        subject { described_class.new(project:).list_labels(deployed_model:) }

        let(:project) { VERTEX_AI_PROJECTS.first }

        let(:deployed_model) { double('deployed_model', model: 'model') }

        let(:label1) { 'label1' }
        let(:label2) { 'label2' }

        let(:service_client_class) { described_class::SERVICE_CLIENT_CLASS }
        let(:service_client_instance) { instance_double(service_client_class, list_model_evaluations:) }

        let(:list_model_evaluations) do
          [
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
          ]
        end

        before { allow(service_client_class).to receive(:new).and_return(service_client_instance) }

        it { is_expected.to eq [label1, label2] }
      end
    end
  end
end
