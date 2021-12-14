# frozen_string_literal: true

require 'rails_helper'

module Evidence 

  RSpec.describe 'FeedbackAssembler' do 
    describe 'to_payload' do 
      let(:example_error) { 'example_error' }
      let(:example_rule_uid) { 123 }
      let(:client_response) do 
        {
          'oapi_error' => example_error,
          'highlight' => [{
            'type': 'response',
            'text': 'someText',
            'character': 0  
          }]
        }
      end

      before do 
        allow(FeedbackAssembler).to receive(:error_to_rule_uid).and_return(
          { example_error => example_rule_uid } 
        )
      end

      context 'OAPI detects no opinion' do 
        it 'should return optimal=true' do 
          expect(
            FeedbackAssembler.run(
              client_response.merge({'oapi_error' => ''})
            )[:optimal]
          ).to eq true
        end
      end

      context 'rule exists' do 
        let!(:rule) do 
          create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
        end

        it 'should lookup a rule and format it' do 
          expect(
            FeedbackAssembler.run(client_response)
          ).to eq({
            concept_uid: 'xyz',
            feedback: nil,
            feedback_type: '',
            optimal: false,
            response_id: '0',
            highlight: [
              { type: 'response', text: 'someText', character: 0 }
            ],
            labels: '',
            rule_uid: example_rule_uid.to_s
          })
        end
      end

      context 'Rule not found' do 
        it 'should return optimal: true' do 
          expect(FeedbackAssembler.run(client_response)[:optimal]).to be true 
        end
      end

      context 'key does not exist in lookup table' do 
        it 'should raise KeyError' do 
          expect do 
           FeedbackAssembler.run({
              'oapi_error' => 'unknown'
            })
          end.to raise_error(KeyError)
        end
      end

    end
  end

end
