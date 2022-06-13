# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Grammar
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

        context 'specific rule checks' do
          context 'their_vs_there_vs_they_re_they_re_optimal' do
            let!(:rule) do
              create(:evidence_rule, uid: 'e4cf078b-a838-445e-a873-c795da9f7ed8', optimal: false, rule_type: 'grammar')
            end

            it 'should return the expected rule uid' do
              error_name = 'their_vs_there_vs_they_re_they_re_optimal'
              expect(
                FeedbackAssembler.run(
                  client_response.merge({FeedbackAssembler.error_name => error_name})
                )[:rule_uid]
              ).to eq rule.uid
            end
          end
        end

        context 'detects no grammar' do
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
