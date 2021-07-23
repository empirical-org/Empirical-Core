require 'rails_helper'

module Comprehension
  RSpec.describe(AutomlCheck, :type => :model) do
    let!(:prompt) { create(:comprehension_prompt) }
    let!(:rule) { create(:comprehension_rule, :rule_type => (Comprehension::Rule::TYPE_AUTOML), :prompts => ([prompt]), :suborder => 0) }
    let!(:label) { create(:comprehension_label, :rule => (rule)) }
    let!(:feedback) { create(:comprehension_feedback, :rule => (rule)) }
    let!(:automl_model) { create(:comprehension_automl_model, :prompt => (prompt), :labels => ([label.name]), :state => (Comprehension::AutomlModel::STATE_ACTIVE)) }

    context 'should #initialize' do

      it 'should should have working accessor methods for all initialized fields' do
        automl_check = Comprehension::AutomlCheck.new("entry", prompt)
        expect("entry").to(eq(automl_check.entry))
        expect(prompt).to(eq(automl_check.prompt))
      end
    end

    context 'should #feedback_object' do

      it 'should return nil if there is no matched rule' do
        AutomlModel.stub_any_instance(:fetch_automl_label, "NOT#{label.name}") do
          automl_check = Comprehension::AutomlCheck.new("entry", prompt)
          expect(nil).to(eq(automl_check.feedback_object))
        end
      end

      it 'should return nil if there is no automl_model associated with the provided prompt' do
        automl_model.destroy
        automl_check = Comprehension::AutomlCheck.new("entry", prompt)
        expect(nil).to(eq(automl_check.feedback_object))
      end

      it 'should return the feedback payload when there is a label match' do
        AutomlModel.stub_any_instance(:fetch_automl_label, label.name) do
          entry = "entry"
          automl_check = Comprehension::AutomlCheck.new(entry, prompt)
          expect(:feedback => feedback.text, :feedback_type => "autoML", :optimal => rule.optimal, :response_id => "", :entry => entry, :concept_uid => ((rule&.concept_uid or "")), :rule_uid => (rule&.uid), :highlight => ([])).to(eq(automl_check.feedback_object))
        end
      end

      it 'should include highlight data when the feedback object has highlights' do
        AutomlModel.stub_any_instance(:fetch_automl_label, label.name) do
          highlight = create(:comprehension_highlight, :feedback => (feedback))
          automl_check = Comprehension::AutomlCheck.new("whatever", prompt)
          expect([{ :type => highlight.highlight_type, :text => highlight.text, :category => "" }]).to(eq(automl_check.feedback_object[:highlight]))
        end
      end
    end
  end
end
