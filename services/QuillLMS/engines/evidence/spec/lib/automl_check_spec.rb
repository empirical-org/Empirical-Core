# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(AutomlCheck, :type => :model) do
    let!(:prompt) { create(:evidence_prompt) }
    let!(:rule) { create(:evidence_rule, :rule_type => Evidence::Rule::TYPE_AUTOML, :prompts => [prompt], :suborder => 0) }
    let!(:low_confidence_rule) { create(:evidence_rule, :rule_type => Evidence::Rule::TYPE_LOW_CONFIDENCE, :prompts => [prompt], :suborder => 0) }
    let!(:label) { create(:evidence_label, :rule => rule) }
    let!(:feedback) { create(:evidence_feedback, :rule => rule) }
    let!(:low_confidence_feedback) { create(:evidence_feedback, :rule => low_confidence_rule) }
    let!(:automl_model) { create(:evidence_automl_model, :prompt => prompt, :labels => [label.name], :state => Evidence::AutomlModel::STATE_ACTIVE) }
    let(:automl_confidence) { 1 }

    context 'should #initialize' do
      it 'should should have working accessor methods for all initialized fields' do
        automl_check = Evidence::AutomlCheck.new('entry', prompt)
        expect(automl_check.entry).to(eq('entry'))
        expect(prompt).to(eq(automl_check.prompt))
      end
    end

    context 'should #feedback_object' do
      it 'should return nil if there is no matched rule' do
        AutomlModel.stub_any_instance(:classify_text, ["NOT#{label.name}", automl_confidence]) do
          automl_check = Evidence::AutomlCheck.new('entry', prompt)
          expect(automl_check.feedback_object).to(eq(nil))
        end
      end

      it 'should return nil if there is no automl_model associated with the provided prompt' do
        automl_model.destroy
        automl_check = Evidence::AutomlCheck.new('entry', prompt)
        expect(automl_check.feedback_object).to(eq(nil))
      end

      it 'should return the feedback payload when there is a label match' do
        AutomlModel.stub_any_instance(:classify_text, [label.name, automl_confidence]) do
          entry = 'entry'
          automl_check = Evidence::AutomlCheck.new(entry, prompt)
          expect(:feedback => feedback.text, :feedback_type => 'autoML', :optimal => rule.optimal, :entry => entry, :concept_uid => ((rule&.concept_uid or '')), :rule_uid => rule&.uid, :highlight => [], :hint => nil, :api => { :confidence => automl_confidence }).to(eq(automl_check.feedback_object))
        end
      end

      it 'should return the low confidence feedback payload when there is a label match but the confidence is below the threshold' do
        AutomlModel.stub_any_instance(:classify_text, [label.name, 0.5]) do
          entry = 'entry'
          automl_check = Evidence::AutomlCheck.new(entry, prompt)
          expected_payload = {
            :feedback => low_confidence_feedback.text,
            :feedback_type => 'low-confidence',
            :optimal => low_confidence_rule.optimal, :entry => entry,
            :concept_uid => ((low_confidence_rule&.concept_uid or '')),
            :rule_uid => low_confidence_rule&.uid,
            :highlight => [],
            :hint => nil,
            :api => {
              :confidence => 0.5,
              :original_rule_name => rule.name,
              :original_rule_uid => rule.uid
            }
          }
          expect(automl_check.feedback_object).to(eq(expected_payload))
        end
      end

      it 'should include highlight data when the feedback object has highlights' do
        AutomlModel.stub_any_instance(:classify_text, [label.name, automl_confidence]) do
          highlight = create(:evidence_highlight, :feedback => feedback)
          automl_check = Evidence::AutomlCheck.new('whatever', prompt)
          expect([{ :type => highlight.highlight_type, :text => highlight.text, :category => '' }]).to(eq(automl_check.feedback_object[:highlight]))
        end
      end

      it 'should include hint data when there is an associated hint' do
        AutomlModel.stub_any_instance(:classify_text, [label.name, automl_confidence]) do
          hint = create(:evidence_hint)
          rule.update(hint: hint)
          automl_check = Evidence::AutomlCheck.new('whatever', prompt)
          expect(hint).to(eq(automl_check.feedback_object[:hint]))
        end
      end
    end
  end
end
