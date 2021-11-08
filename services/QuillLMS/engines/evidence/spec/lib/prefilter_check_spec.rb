require 'rails_helper'

module Evidence
  RSpec.describe(PrefilterCheck) do
    let(:rule_factory_overrides) { {rule_type: 'prefilter', universal: true, optimal: false} }

    describe '#initialize' do
      it 'should retrieve associated Rules' do
        rule = create(:evidence_rule, rule_type: 'prefilter')
        prefilter_check = Evidence::PrefilterCheck.new("entry")
        expect(prefilter_check.prefilter_rules.first).to eq(rule)
      end
    end

    describe '#feedback_object' do
      context 'question mark violation' do 
        let!(:question_mark_rule) do 
          create(:evidence_rule, **rule_factory_overrides, uid: 'f576dadc-7eec-4e27-8c95-7763e6550141')
        end
        let!(:question_mark_feedback) do 
          create(:evidence_feedback, text: 'question mark feedback', rule_id: question_mark_rule.id)
        end

        it 'returns a valid response' do
          prefilter_check = Evidence::PrefilterCheck.new('A question?')
          response = prefilter_check.feedback_object
          expect(response[:rule_uid]).to eq 'f576dadc-7eec-4e27-8c95-7763e6550141'
          expect(response[:optimal]).to eq false
          expect(response[:feedback]).to eq question_mark_feedback.text
        end
      end

      context 'no violation' do 
        before do 
          PrefilterCheck && stub_const('PrefilterCheck::PREFILTERS', {})
        end

        it 'should return default_response' do 
          prefilter_check = Evidence::PrefilterCheck.new('example entry')
          result = prefilter_check.feedback_object
          expect(result).to eq(prefilter_check.default_response)
        end
      end
    end

  end
end
