# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Grammar
    RSpec.describe 'FeedbackAssembler' do
      describe '#run' do
        let(:client_response) do
          {
            'highlight' => [{
              'type' => 'response',
              'text' => 'someText',
              'character' => 0
            }]
          }
        end
        let!(:rule) do
          create(:evidence_rule, uid: 'e4cf078b-a838-445e-a873-c795da9f7ed8', optimal: false, rule_type: 'grammar')
        end
        let!(:feedback1) do
          create(:evidence_feedback, rule: rule, text: 'this is the text for feedback 1', order: 1)
        end
        let!(:feedback2) do
          create(:evidence_feedback, rule: rule, text: 'this is the text for feedback 2', order: 2)
        end

        let(:error_name) { 'their_vs_there_vs_they_re_they_re_optimal' }

        context 'specific rule checks' do
          context 'their_vs_there_vs_they_re_they_re_optimal' do
            it 'should return the expected rule uid' do
              uid = rule.uid
              expect(
                FeedbackAssembler.run(
                  client_response: client_response.merge({ FeedbackAssembler.error_name => error_name })
                )[:rule_uid]
              ).to eq uid
            end
          end
        end

        context 'detects no grammar' do
          it 'should return optimal=true' do
            expect(
              FeedbackAssembler.run(
                client_response: client_response.merge({ FeedbackAssembler.error_name => '' })
              )[:optimal]
            ).to eq true
          end
        end

        context 'previous feedback does not exist' do
          it 'should return secondary feedback' do
            result = FeedbackAssembler.run(
              client_response: client_response.merge({ FeedbackAssembler.error_name => error_name }),
              previous_feedback: []
            )
            expect(result[:feedback]).to eq feedback1.text
          end
        end

        context 'previous feedback exists' do
          it 'should return secondary feedback' do
            mocked_feedback_history = {
              'feedback_type' => 'grammar',
              'feedback'      => feedback1.text
            }

            result = FeedbackAssembler.run(
              client_response: client_response.merge({ FeedbackAssembler.error_name => error_name }),
              previous_feedback: [mocked_feedback_history]
            )
            expect(result[:feedback]).to eq feedback2.text
          end
        end

        context 'grammar highlight has an exception' do
          before do
            stub_const('Evidence::Grammar::FeedbackAssembler::EXCEPTIONS', exceptions)
          end

          let(:exceptions) { ['some phrase', 'other'] }

          subject { FeedbackAssembler.run(client_response: client_response.merge({ FeedbackAssembler.error_name => error_name })) }

          context 'exact match' do
            let(:client_response) do
              {
                'highlight' => [{
                'type' => 'response',
                'text' => exceptions.first,
                'character' => 0
                }]
              }
            end

            it 'should return optimal=true' do
              expect(subject[:optimal]).to be true
            end
          end

          context 'not matching capitalization' do
            let(:client_response) do
              {
                'highlight' => [{
                'type' => 'response',
                'text' => exceptions.first.upcase,
                'character' => 0
                }]
              }
            end

            it 'should return optimal=true' do
              expect(subject[:optimal]).to be true
            end
          end

          context 'partial match' do
            let(:client_response) do
              {
                'highlight' => [{
                'type' => 'response',
                'text' => exceptions.first.split.first,
                'character' => 0
                }]
              }
            end

            it 'should return optimal=false' do
              expect(subject[:optimal]).to be false
            end
          end

          context 'capitalization in exception' do
            let(:exceptions) { ['Some Phrase'] }
            let(:client_response) do
              {
                'highlight' => [{
                'type' => 'response',
                'text' => exceptions.first,
                'character' => 0
                }]
              }
            end

            it 'should return optimal=true' do
              expect(subject[:optimal]).to be true
            end
          end
        end
      end
    end
  end
end
