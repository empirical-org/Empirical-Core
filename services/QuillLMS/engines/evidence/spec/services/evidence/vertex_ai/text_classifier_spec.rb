# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module VertexAI
    RSpec.describe TextClassifier do
      subject { described_class.run(endpoint_external_id:, project:, text:) }

      let(:endpoint_external_id) { 'endpoint-external_id' }
      let(:project) { VERTEX_AI_PROJECTS.first }
      let(:prediction_client_class) { ::Google::Cloud::AIPlatform::V1::PredictionService::Client }
      let(:prediction_client) { instance_double(prediction_client_class) }
      let(:text) { 'some text' }
      let(:labels) { ['Label1', 'Label2', 'Label3'] }
      let(:display_name_values) { labels.map { |label| ::Google::Protobuf::Value.new(string_value: label) } }
      let(:display_name_list_value) { ::Google::Protobuf::ListValue.new(values: display_name_values) }

      let(:scores) { [0.4, 0.9, 0.8] }
      let(:confidence_values) { scores.map { |score| Google::Protobuf::Value.new(number_value: score) } }
      let(:confidence_list_value) { ::Google::Protobuf::ListValue.new(values: confidence_values) }

      let(:top_score_index) { scores.each_with_index.max[1] }
      let(:label) { labels[top_score_index] }
      let(:score) { scores[top_score_index] }

      let(:results) do
        {
          'confidences' => ::Google::Protobuf::Value.new(list_value: confidence_list_value),
          'displayNames' => ::Google::Protobuf::Value.new(list_value: display_name_list_value)
        }
      end

      let(:prediction) { ::Google::Protobuf::Value.new(struct_value: { fields: results }) }
      let(:prediction_response) { ::Google::Cloud::AIPlatform::V1::PredictResponse.new(predictions: [prediction]) }
      let(:endpoint) { described_class.new(endpoint_external_id:, project:, text: '').send(:endpoint) }
      let(:instances) { [::Google::Protobuf::Value.new(struct_value: { fields: { content: { string_value: text } } })] }

      before { allow(prediction_client_class).to receive(:new).and_return(prediction_client) }

      context 'successful prediction' do
        before do
          allow(prediction_client)
            .to receive(:predict)
            .with(endpoint:, instances:)
            .and_return(prediction_response)
        end

        it { is_expected.to eq [label, score] }
      end

      context 'error handling' do
        let(:error) { ::Google::Cloud::Error.new }

        before { allow(prediction_client).to receive(:predict).and_raise(error) }

        it { expect { subject }.to raise_error(error) }

        described_class::PREDICTION_EXCEPTION_CLASSES.each do |error_class|
          context "with #{error_class}" do
            let(:error) { error_class.new }

            before do
              call_count = 0
              allow(prediction_client).to receive(:predict) do
                call_count += 1
                call_count == 1 ? raise(error): prediction_response
              end
            end

            it 'retries once and does not raise error' do
              expect { subject }.not_to raise_error
            end
          end
        end

        context 'with persistent errors' do
          let(:error) { Google::Cloud::InternalError.new }

          before { allow(prediction_client).to receive(:predict).and_raise(error) }

          it 'raises the error after retrying' do
            expect { subject }.to raise_error(error)
          end
        end
      end
    end
  end
end
