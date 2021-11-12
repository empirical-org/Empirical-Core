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
      let!(:prefilter_rule1) do 
        create(:evidence_rule, **rule_factory_overrides, uid: '123')
      end

      let(:non_prefilter_rule) { create(:evidence_rule, **rule_factory_overrides, rule_type: 'notPrefilter') }

      context 'PREFILTERS query hit' do 
        before do 
          Evidence::PrefilterCheck && stub_const('Evidence::PrefilterCheck::PREFILTERS', {
            '123' => ->(x) { false }
          })
        end

        it 'returns a valid payload' do
          prefilter_check = Evidence::PrefilterCheck.new('example entry')
          response = prefilter_check.feedback_object
          expect(response[:rule_uid]).to eq '123'
          expect(response[:optimal]).to eq false
        end

        it 'returns a valid payload with feedback' do
          feedback = create(:evidence_feedback, text: 'lorem ipsum', rule_id: prefilter_rule1.id)
          prefilter_check = Evidence::PrefilterCheck.new('example entry')
          response = prefilter_check.feedback_object
          expect(response[:feedback]).to eq feedback.text
        end
      end

      context 'PREFILTERS query miss' do 
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
