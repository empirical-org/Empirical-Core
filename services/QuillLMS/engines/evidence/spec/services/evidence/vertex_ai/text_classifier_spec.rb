# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe TextClassifier do
      subject { described_class.run(endpoint_external_id:, project:, text:) }

      let(:project) { VERTEX_AI_PROJECTS.first }
      let(:endpoint_external_id) { 'endpoint_external_id' }
      let(:text) { 'sample text' }

      let(:label) { 'label' }
      let(:score) { 0.9 }

      let(:prediction_client) { instance_double(PredictionClient) }
      let(:prediction_response) { double(::Google::Cloud::AIPlatform::V1::PredictResponse, predictions:) }
      let(:predictions) { [::Google::Protobuf::Value.new(struct_value: ::Google::Protobuf::Struct.new(fields: prediction))] }

      let(:prediction) do
        {
          'confidences' => ::Google::Protobuf::Value.new(
            list_value: ::Google::Protobuf::ListValue.new(
              values: [::Google::Protobuf::Value.new(number_value: score)]
            )
          ),
          'displayNames' => ::Google::Protobuf::Value.new(
            list_value: ::Google::Protobuf::ListValue.new(
              values: [::Google::Protobuf::Value.new(string_value: label)]
            )
          )
        }
      end

      before { allow(PredictionClient).to receive(:new).with(project:).and_return(prediction_client) }

      context 'successful prediction' do
        before do
          allow(prediction_client)
            .to receive(:predict_label_and_score)
            .with(endpoint_external_id:, text:)
            .and_return(prediction_response)
        end

        it { is_expected.to eq([label, score]) }
      end

      context 'error handling' do
        let(:error) { ::Google::Cloud::Error.new }

        before do
          allow(prediction_client)
            .to receive(:predict_label_and_score)
            .with(endpoint_external_id:, text:)
            .and_raise(error)
        end

        it { expect { subject }.to raise_error(error) }

        described_class::PREDICTION_EXCEPTION_CLASSES.each do |error_class|
          context "with #{error_class}" do
            let(:error) { error_class.new }

            before do
              call_count = 0
              allow(prediction_client).to receive(:predict_label_and_score) do
                call_count += 1
                call_count == 1 ? raise(error) : prediction_response
              end
            end

            it 'retries once and does not raise error' do
              expect { subject }.not_to raise_error
            end
          end
        end

        context 'with persistent errors' do
          let(:error) { Google::Cloud::InternalError.new }

          before do
            allow(prediction_client)
              .to receive(:predict_label_and_score)
              .with(endpoint_external_id:, text:)
              .and_raise(error)
          end

          it 'raises the error after retrying' do
            expect { subject }.to raise_error(error)
          end
        end
      end
    end
  end
end
