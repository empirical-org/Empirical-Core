# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(ChangeLog, :type => :module) do

    before do
      @activity = create(:evidence_activity)
      @prompt = create(:evidence_prompt, activity: @activity)
      @rule = create(:evidence_rule, rule_type: Evidence::Rule::TYPE_PLAGIARISM, prompts: [@prompt], suborder: 0)
      @plagiarism_text = create(:evidence_plagiarism_text, rule: @rule)
      @feedback = create(:evidence_feedback, rule: @rule)
      @automl= create(:evidence_automl_model, prompt: @prompt)
      @passage = create(:evidence_passage, activity: @activity)
      @highlight = create(:evidence_highlight, feedback: @feedback)
    end

    context 'change_logs_for_activity' do
      it 'should fetch changes related to that activity' do
        log = Evidence.change_log_class.create(action: 'Evidence Activity - created', changed_record_type: 'Evidence::Activity', changed_record_id: @activity.id)
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["action"] == 'Evidence Activity - created'}.count, 1
      end

      it "should fetch changes related to that activity's children models" do
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["changed_record_type"] == 'Evidence::Passage'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Evidence::AutomlModel'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Evidence::Feedback'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Evidence::Rule'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Evidence::PlagiarismText'}.count, 1
        assert change_logs.select {|cl| cl["changed_record_type"] == 'Evidence::Highlight'}.count, 1
      end

      it "should fetch changes related to universal rules" do
        universal_rule = create(:evidence_rule, rule_type: 'spelling')
        change_logs = @activity.change_logs

        assert change_logs.select {|cl| cl["action"] == 'Universal Rule - created'}.count, 1
      end
    end

    context 'activity_versions' do
      it 'should fetch the versions for the activity' do
        versions = @activity.activity_versions

        assert versions.select {|version| version["note"] == 'Activity Created'}.count, 1
        assert versions.select {|version| version["created_at"] == @activity.created_at}.count, 1
        assert versions.select {|version| version["new_value"] == '1'}.count, 1
        assert versions.select {|version| version["session_count"] == 0}.count, 1
      end
    end
  end
end
