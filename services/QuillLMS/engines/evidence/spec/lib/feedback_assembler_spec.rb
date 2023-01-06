# frozen_string_literal: true

require 'rails_helper'

module Evidence

  RSpec.describe 'FeedbackAssembler' do
    describe '#run' do
      let(:example_error) { 'example_error' }
      let(:example_rule_uid) { 123 }
      let(:client_response) do
        {
          'abstract_error' => example_error,
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
        allow(FeedbackAssembler).to receive(:error_name).and_return 'abstract_error'
      end

      context 'detects no opinion' do
        it 'should return optimal=true' do
          expect(
            FeedbackAssembler.run(
              client_response.merge({'abstract_error' => ''})
            )[:optimal]
          ).to eq true
        end
      end

      context 'rule exists' do
        let!(:rule) do
          create(:evidence_rule, uid: example_rule_uid, optimal: false, concept_uid: 'xyz')
        end
        let!(:feedback) { create(:evidence_feedback, rule: rule, text: 'First feedback', order: 1) }
        let!(:feedback2) { create(:evidence_feedback, rule: rule, text: 'Second feedback', order: 2) }

        it 'should lookup a rule and format it' do
          expect(
            FeedbackAssembler.run(client_response)
          ).to eq({
            concept_uid: 'xyz',
            feedback: feedback.text,
            feedback_type: '',
            optimal: false,
            highlight: [
              { type: 'response', text: 'someText', character: 0 }
            ],
            hint: rule.hint,
            labels: '',
            rule_uid: example_rule_uid.to_s
          })
        end

        it 'should use the higher order feedback when lower order feedback is in history' do
          feedback_history = [{
            'feedback_type' => feedback.rule.rule_type,
            'feedback' => feedback.text
          }]
          expect(
            FeedbackAssembler.run(client_response, feedback_history)[:feedback]
          ).to eq(feedback2.text)
        end

        it 'should use the highest order feedback when all feedback is in history' do
          feedback_history = [{
            'feedback_type' => feedback.rule.rule_type,
            'feedback' => feedback.text
          },{
            'feedback_type' => feedback2.rule.rule_type,
            'feedback' => feedback2.text
          }]
          expect(
            FeedbackAssembler.run(client_response, feedback_history)[:feedback]
          ).to eq(feedback2.text)
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
               'abstract_error' => 'unknown'
             })
          end.to raise_error(KeyError)
        end
      end

    end
  end

end
