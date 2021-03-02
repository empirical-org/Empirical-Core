require 'test_helper'

module Comprehension
  class AutomlCheckTest < ActiveSupport::TestCase
    setup do
      @prompt = create(:comprehension_prompt)
      @rule = create(:comprehension_rule, rule_type: Comprehension::Rule::TYPE_AUTOML, prompts: [@prompt], suborder: 0)
      @label = create(:comprehension_label, rule: @rule)
      @feedback = create(:comprehension_feedback, rule: @rule)
      @automl_model = create(:comprehension_automl_model, prompt: @prompt, labels: [@label.name], state: Comprehension::AutomlModel::STATE_ACTIVE)
    end

    context '#initialize' do
      should 'should have working accessor methods for all initialized fields' do
        automl_check = Comprehension::AutomlCheck.new("entry", @prompt)
        assert_equal automl_check.entry, "entry"
        assert_equal automl_check.prompt, @prompt
      end
    end

    context '#feedback_object' do
      should 'return nil if there is no matched rule' do
        AutomlModel.stub_any_instance(:fetch_automl_label, "NOT#{@label.name}") do
          automl_check = Comprehension::AutomlCheck.new("entry", @prompt)
          assert_equal automl_check.feedback_object, nil
        end
      end

      should 'return the feedback payload when there is a label match' do
        AutomlModel.stub_any_instance(:fetch_automl_label, @label.name) do
          entry = 'entry'
          automl_check = Comprehension::AutomlCheck.new(entry, @prompt)
          assert_equal automl_check.feedback_object, {
            feedback: @feedback.text,
            feedback_type: Rule::TYPE_AUTOML,
            optimal: @rule.optimal,
            response_id: '',
            entry: entry,
            concept_uid: @rule&.concept_uid || '',
            rule_uid: @rule&.uid,
            highlight: []
          }
        end
      end

      should 'include highlight data when the feedback object has highlights' do
        AutomlModel.stub_any_instance(:fetch_automl_label, @label.name) do
          highlight = create(:comprehension_highlight, feedback: @feedback)
          automl_check = Comprehension::AutomlCheck.new('whatever', @prompt)

          assert_equal automl_check.feedback_object[:highlight], [{
            type: highlight.highlight_type,
            text: highlight.text,
            category: ''
          }]
        end
      end
    end
  end
end
