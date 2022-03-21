# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UniversalRuleLoader do

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
      let(:csv1) do
        <<~HEREDOC
          Rule UID,Rule,Concept UID,Feedback - Revised,Activity,Module
          1d66a,ExistingRule,4d5e3,the feedback,Universal,Grammar API
        HEREDOC
      end

      let(:csv2) do
        <<~HEREDOC
          Rule UID,Rule,Concept UID,Feedback - Revised,Activity,Module
          abc6a,invalidRule1,9999,the feedback,,Grammar API
          Dbc6a,invalidRule2,9999,the feedback,Universal,Opinion API
        HEREDOC
      end

      let(:csv3) do
        <<~HEREDOC
          Rule UID,Rule,Concept UID,Feedback - Revised,Activity,Module
          abc6a,invalidRule1,9999,the feedback,Universal,Grammar API
        HEREDOC
      end

      it 'should raise exception if type is invalid' do
        expect do
          UniversalRuleLoader.update_from_csv(type: 'badType', iostream: csv2)
        end.to raise_error(ArgumentError)
      end

      it 'should ignore rules that are not universal or grammar' do
        expect do
          UniversalRuleLoader.update_from_csv(type: rule_type, iostream: csv2)
        end.to change { Evidence::Rule.count }.by(0)
        .and change { Evidence::Feedback.count }.by(0)
      end

      it 'should not create a rule when a rule exists that is not universal or grammar' do
        rule = rule_factory { { uid: 'abc6a', rule_type: rule_type, universal: false } }
        expect do
          UniversalRuleLoader.update_from_csv(type: rule_type, iostream: csv3)
        end.to change { Evidence::Rule.count }.by(0)
        .and change { Evidence::Feedback.count }.by(0)
      end


      it 'should update existing rule and update feedback' do
        rule = rule_factory { { uid: '1d66a', rule_type: rule_type, universal: true } }
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
