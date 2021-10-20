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
        Opinion::FeedbackAssembler && stub_const(
          'Evidence::Opinion::FeedbackAssembler::OAPI_ERROR_TO_RULE_UID', 
          { example_error => example_rule_uid }
        )
      end

      context 'rule exists' do 
        let!(:rule) do 
          create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
        end

        it 'should lookup a rule and format it' do 
          assembler = Opinion::FeedbackAssembler.new(client_response)
          expect(assembler.to_payload).to eq({
            concept_uid: 'xyz',
            feedback: nil,
            feedback_type: 'opinion',
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
          assembler = Opinion::FeedbackAssembler.new(client_response)
          expect(assembler.to_payload[:optimal]).to be true 
        end
      end

      context 'key does not exist in lookup table' do 
        it 'should raise KeyError' do 
          expect do 
            assembler = Opinion::FeedbackAssembler.new({
              'oapi_error' => 'unknown'
            })
          end.to raise_error(KeyError)
        end
      end

    end
  end

end
