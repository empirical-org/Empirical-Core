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

      let(:oapi_response) do 
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
        create(:evidence_rule, uid: example_rule_uid)
      end

      before do 
        # If you are unsure of the motivation behind the following line,
        # the answers are here: https://github.com/rspec/rspec-mocks/issues/1079
        OpinionFeedbackAssembler && stub_const(
          'Evidence::OpinionFeedbackAssembler::OAPI_ERROR_TO_RULE_UID', 
          { example_error => example_rule_uid }
        )
        allow(::HTTParty).to receive(:post).and_return(oapi_response)
      end

      it 'should return a valid json response' do 
        post :fetch, params: incoming_payload, as: :json

        expect(JSON.parse(response.body)).to eq({
          'concept_uid' => 'ConceptUID',
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
            'concept_uid' => 'ConceptUID',
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
