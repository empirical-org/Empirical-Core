# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(OpinionController, :type => :controller) do
    before { @routes = Engine.routes }

    describe '#fetch' do 
      let(:example_error) { 'example_error' }
      let(:example_rule_uid) { 123 }
      let(:incoming_payload) do 
        { 
          'entry' => 'eat junk food at home.', 
          'prompt_text' => 'Schools should not allow junk food to be sold on campus, but'
        }
      end

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

      let!(:rule) do 
        create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
      end

      before do 
        allow(Opinion::FeedbackAssembler).to receive(:error_to_rule_uid).and_return(
          { example_error => example_rule_uid } 
        )
        allow_any_instance_of(Opinion::Client).to receive(:post).and_return(client_response)
      end

      it 'should return a valid json response' do 
        post :fetch, params: incoming_payload, as: :json

        expect(JSON.parse(response.body)).to eq({
          'concept_uid' => 'xyz',
          'feedback' => nil,
          'feedback_type' => 'opinion',
          'optimal' => false,
          'response_id' => '0',
          'highlight' => [
            { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
          ],
          'labels' => '',
          'rule_uid' => example_rule_uid.to_s
        })
      end

      context 'Rule.feedback exists' do 
        before do 
          create(:evidence_feedback, rule_id: rule.id, text: 'lorem ipsum')
        end
        it 'should return a valid json response' do 
          post :fetch, params: incoming_payload, as: :json

          expect(JSON.parse(response.body)).to eq({
            'concept_uid' => 'xyz',
            'feedback' => 'lorem ipsum',
            'feedback_type' => 'opinion',
            'optimal' => false,
            'response_id' => '0',
            'highlight' => [
              { 'type' => 'response', 'text' => 'someText', 'character' => 0 }
            ],
            'labels' => '',
            'rule_uid' => example_rule_uid.to_s
          })
        end
      end

    end
  end
end
