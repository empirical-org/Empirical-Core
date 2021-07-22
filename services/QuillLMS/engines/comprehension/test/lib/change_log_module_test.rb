require 'test_helper'

module Comprehension
  class ChangeLogModuleTest < ActiveSupport::TestCase

    setup do
      @activity = create(:comprehension_activity)
      @prompt = create(:comprehension_prompt, activity: @activity)
      @rule = create(:comprehension_rule, rule_type: Comprehension::Rule::TYPE_PLAGIARISM, prompts: [@prompt], suborder: 0)
      @plagiarism_text = create(:comprehension_plagiarism_text, rule: @rule)
      @feedback = create(:comprehension_feedback, rule: @rule)
      @automl= create(:comprehension_automl_model, prompt: @prompt)
      @passage = create(:comprehension_passage, activity: @activity)
      @highlight = create(:comprehension_highlight, feedback: @feedback)
    end

    context 'change_logs_for_activity' do
      should 'should fetch changes related to that activity' do
        log = Comprehension.change_log_class.create(action: 'Comprehension Activity - created', changed_record_type: 'Comprehension::Activity', changed_record_id: @activity.id)
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["action"] == 'Comprehension Activity - created'}.count, 1
      end
    end

    context 'change_logs_for_activity' do
      should 'should fetch changes related to that activity' do
        log = Comprehension.change_log_class.create(action: 'Comprehension Activity - created', changed_record_type: 'Comprehension::Activity', changed_record_id: @activity.id)
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["action"] == 'Comprehension Activity - created'}.count, 1
      end

      should "should fetch changes related to that activity's children models" do
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["changed_record_type"] == 'Comprehension::Passage'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Comprehension::AutomlModel'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Comprehension::Feedback'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Comprehension::Rule'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Comprehension::PlagiarismText'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Comprehension::Highlight'}.count, 1
      end

      should "should fetch changes related to universal rules" do
        universal_rule = create(:comprehension_rule, rule_type: 'spelling')
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["action"] == 'Universal Rule - created'}.count, 1
      end
    end
  end
end
