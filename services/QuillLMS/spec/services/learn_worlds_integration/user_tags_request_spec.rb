# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::UserTagsRequest do
  let(:example_external_id) { 123 }
  let(:example_tags) { ['math'] }

  describe '#run' do
    context 'invalid parameters' do
      it 'should raise Argument error' do
        expect do
          described_class.run(example_external_id, 'i dont belong here')
        end.to raise_error ArgumentError
      end
    end

    context 'valid parameters' do
      it 'invokes a PUT request' do
        expect(HTTParty).to receive(:put)
        described_class.run(example_external_id, example_tags)
      end
    end
  end
end
