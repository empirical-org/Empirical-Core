# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(RegexCheck, :type => :model) do
    let!(:prompt) { create(:evidence_prompt) }
    let!(:rule) { create(:evidence_rule, :rule_type => "rules-based-1", :prompts => ([prompt]), :suborder => 0) }
    let!(:regex_rule) { create(:evidence_regex_rule, :rule => (rule), :regex_text => "^Test") }
    let!(:feedback) { create(:evidence_feedback, :rule => (rule), :text => "This string begins with the word Test!") }

    context 'should #initialize' do

      it 'should should have working accessor methods for all initialized fields' do
        regex_check = Evidence::RegexCheck.new("entry", prompt, rule.rule_type)
        expect(regex_check.entry).to(eq("entry"))
        expect(prompt).to(eq(regex_check.prompt))
      end
    end

    context 'should #feedback_object' do

      it 'should return optimal blank feedback when there is no regex match' do
        $redis.redis.flushdb
        optimal_rule = create(:evidence_rule, :rule_type => "rules-based-1", :optimal => true)
        entry = "this is not a good regex match"
        regex_check = Evidence::RegexCheck.new(entry, prompt, optimal_rule.rule_type)
        feedback = regex_check.feedback_object
        expect(Evidence::RegexCheck::ALL_CORRECT_FEEDBACK).to(eq(feedback[:feedback]))
        expect(optimal_rule.rule_type).to(eq(feedback[:feedback_type]))
        expect(feedback[:optimal]).to(be_truthy)
        expect(entry).to(eq(feedback[:entry]))
        expect(feedback[:concept_uid]).to(eq(""))
        expect(optimal_rule.uid).to(eq(feedback[:rule_uid]))
      end

      it 'should be false when there is a regex match' do
        entry = "Test this is a good regex match"
        regex_check = Evidence::RegexCheck.new(entry, prompt, rule.rule_type)
        local_feedback = regex_check.feedback_object
        expect(feedback.text).to(eq(local_feedback[:feedback]))
        expect(rule.rule_type).to(eq(local_feedback[:feedback_type]))
        expect(local_feedback[:optimal]).to(be_falsey)
        expect(entry).to(eq(local_feedback[:entry]))
        expect(rule.concept_uid).to(eq(local_feedback[:concept_uid]))
        expect(rule.uid).to(eq(local_feedback[:rule_uid]))
      end

      it 'should return the highest priority feedback when two feedbacks exist' do
        new_rule = create(:evidence_rule, :rule_type => "rules-based-1", :prompts => ([prompt]), :suborder => 1)
        new_regex_rule = create(:evidence_regex_rule, :rule => new_rule, :regex_text => "^Testing")
        entry = "Test this is a good regex match"
        regex_check = Evidence::RegexCheck.new(entry, prompt, rule.rule_type)
        feedback = regex_check.feedback_object
        expect(rule.uid).to(eq(feedback[:rule_uid]))
      end

      it 'should include any highlights that are attached to the feedback it returns' do
        highlight = create(:evidence_highlight, feedback: feedback)
        entry = "Test this is a good regex match"
        regex_check = Evidence::RegexCheck.new(entry, prompt, rule.rule_type)
        local_feedback = regex_check.feedback_object
        expect(feedback.text).to(eq(local_feedback[:feedback]))
        expect(rule.rule_type).to(eq(local_feedback[:feedback_type]))
        expect(local_feedback[:optimal]).to(be_falsey)
        expect(entry).to(eq(local_feedback[:entry]))
        expect(rule.concept_uid).to(eq(local_feedback[:concept_uid]))
        expect(rule.uid).to(eq(local_feedback[:rule_uid]))
        expect(local_feedback[:highlight].length).to eq(1)
        expect(local_feedback[:highlight].first[:text]).to eq(highlight.text)
        expect(local_feedback[:highlight].first[:type]).to eq(highlight.highlight_type)
      end
    end
  end
end
