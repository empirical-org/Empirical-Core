require 'rails_helper'

RSpec.describe UniversalRuleLoader do
  let(:csv1) do 
    <<~EOS
      Rule UID,Rule,Concept UID,Feedback - Revised
      1d66a,ExtantRule,4d5e3,the feedback
    EOS
  end

  def rule_factory(&hash_block)
    Evidence::Rule.create!(
      {
        uid: SecureRandom.uuid,
        name: 'name',
        universal: true,
        suborder: 1,
        rule_type: Evidence::Rule::TYPES.first,
        optimal: true,
        concept_uid: SecureRandom.uuid,
        state: Evidence::Rule::STATES.first
      }.merge(yield)
    )
  end

  def feedback_factory(&hash_block)
    Evidence::Feedback.create!(
      {
        rule: rule_factory { {} },
        text: 'Feedback string',
        description: 'Internal description of feedback',
        order: 1
      }.merge(yield)
    )
  end

  describe '#update_from_csv' do 
    context 'grammar rules' do 
      let(:rule_type) { 'grammar' }

      it 'should update existing rule and update feedback' do 
        rule = rule_factory { { uid: '1d66a', rule_type: rule_type } }
        feedback_factory { { rule: rule, order: 0 } }

        expect do 
          UniversalRuleLoader.update_from_csv(type: rule_type, iostream: csv1)
        end.to change { Evidence::Rule.count }.by(0)
        .and change { Evidence::Feedback.count }.by(0)

        rule = Evidence::Rule.find_by_uid '1d66a'
        expect(rule.concept_uid).to eq '4d5e3'

        feedback = Evidence::Feedback.first 
        expect([feedback.rule_id, feedback.text]).to eq(
          [rule.id, 'the feedback']
        )
      end

      it 'should create a new rule and new feedback' do
        expect do 
          UniversalRuleLoader.update_from_csv(type: rule_type, iostream: csv1)
        end.to change { Evidence::Rule.count }.by(1)
        .and change { Evidence::Feedback.count }.by(1)

        rule = Evidence::Rule.find_by_uid '1d66a'
        expect(rule.concept_uid).to eq '4d5e3'

        feedback = Evidence::Feedback.first 
        expect([feedback.rule_id, feedback.text]).to eq(
          [rule.id, 'the feedback']
        )
      end

    end
  end


end