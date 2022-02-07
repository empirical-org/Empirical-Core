# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Opinion
    RSpec.describe 'FeedbackAssembler' do
      describe '#run' do
        let(:example_error) { 'example_error' }
        let(:example_rule_uid) { 123 }
        let(:client_response) do
          {
            'highlight' => [{
              'type': 'response',
              'text': 'someText',
              'character': 0
            }]
          }
        end

        context 'detects no opinion' do
          it 'should return optimal=true' do
            expect(
              FeedbackAssembler.run(
                client_response.merge({FeedbackAssembler.error_name => ''})
              )[:optimal]
            ).to eq true
          end
        end
      end
    end

  end
end
