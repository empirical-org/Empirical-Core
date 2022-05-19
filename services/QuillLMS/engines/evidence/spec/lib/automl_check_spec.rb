# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(AutomlCheck, :type => :model) do
    let!(:prompt) { create(:evidence_prompt) }
    let!(:rule) { create(:evidence_rule, :rule_type => (Evidence::Rule::TYPE_AUTOML), :prompts => ([prompt]), :suborder => 0) }
    let!(:label) { create(:evidence_label, :rule => (rule)) }
    let!(:feedback) { create(:evidence_feedback, :rule => (rule)) }
    let!(:automl_model) { create(:evidence_automl_model, :prompt => (prompt), :labels => ([label.name]), :state => (Evidence::AutomlModel::STATE_ACTIVE)) }
    let(:automl_confidence) { 1 }

    context 'should #initialize' do

      it 'should should have working accessor methods for all initialized fields' do
        automl_check = Evidence::AutomlCheck.new("entry", prompt)
        expect(automl_check.entry).to(eq("entry"))
        expect(prompt).to(eq(automl_check.prompt))
      end
    end

    context 'should #feedback_object' do

      it 'should return nil if there is no matched rule' do
        AutomlModel.stub_any_instance(:fetch_automl_label, ["NOT#{label.name}", automl_confidence]) do
          automl_check = Evidence::AutomlCheck.new("entry", prompt)
          expect(automl_check.feedback_object).to(eq(nil))
        end
      end

      it 'should return nil if there is no automl_model associated with the provided prompt' do
        automl_model.destroy
        automl_check = Evidence::AutomlCheck.new("entry", prompt)
        expect(automl_check.feedback_object).to(eq(nil))
      end

      it 'should return the feedback payload when there is a label match' do
        AutomlModel.stub_any_instance(:fetch_automl_label, [label.name, automl_confidence]) do
          entry = "entry"
          automl_check = Evidence::AutomlCheck.new(entry, prompt)
          expect(:feedback => feedback.text, :feedback_type => "autoML", :optimal => rule.optimal,  :entry => entry, :concept_uid => ((rule&.concept_uid or "")), :rule_uid => (rule&.uid), :highlight => ([]), :hint => nil, :api => {:confidence => automl_confidence}).to(eq(automl_check.feedback_object))
        end
      end

      it 'should include highlight data when the feedback object has highlights' do
        AutomlModel.stub_any_instance(:fetch_automl_label, [label.name, automl_confidence]) do
          highlight = create(:evidence_highlight, :feedback => (feedback))
          automl_check = Evidence::AutomlCheck.new("whatever", prompt)
          expect([{ :type => highlight.highlight_type, :text => highlight.text, :category => "" }]).to(eq(automl_check.feedback_object[:highlight]))
        end
      end

      it 'should include hint data when there is an associated hint' do
        AutomlModel.stub_any_instance(:fetch_automl_label, [label.name, automl_confidence]) do
          hint = create(:evidence_hint, :rule => (rule))
          automl_check = Evidence::AutomlCheck.new("whatever", prompt)
          expect(hint).to(eq(automl_check.feedback_object[:hint]))
        end
      end

    end
  end
end
