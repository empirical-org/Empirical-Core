# frozen_string_literal: true

require 'rails_helper'

require("webmock/minitest")
module Evidence
  RSpec.describe(SpellingCheck, :type => :model) do

    context 'should #feedback_object' do

      it 'should return appropriate feedback attributes if there is a spelling error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20a%20spelin%20error%20here").to_return(:status => 200, :body => { :flaggedTokens => ([{ :token => "spelin" }]) }.to_json, :headers => ({}))
        entry = "there is a spelin error here"
        spelling_check = Evidence::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_falsey)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
        expect(feedback[:highlight][0][:text]).to(be_truthy)
      end

      it 'should not flag error if the spelling error downcased is in exception list' do
        spelling_error = "SpeliN"
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20a%20spelin%20error%20here").to_return(:status => 200, :body => { :flaggedTokens => ([{ :token => spelling_error }]) }.to_json, :headers => ({}))
        stub_const("Evidence::SpellingCheck::EXCEPTIONS", [spelling_error.downcase])
        entry = "there is a spelin error here"
        spelling_check = Evidence::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object

        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to be true
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
        expect(feedback[:highlight]).to be_empty
      end

      it 'should return appropriate feedback attributes if there is no spelling error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 200, :body => { :flaggedTokens => ({}) }.to_json, :headers => ({}))
        entry = "there is no spelling error here"
        spelling_check = Evidence::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end

      it 'should return appropriate feedback attributes if there is no spelling error even if Bing does not return a "flaggedTokens" value' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 200, :body => {}.to_json, :headers => ({}))
        entry = "there is no spelling error here"
        spelling_check = Evidence::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end

      it 'should raise error if the Bing API request times out' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_timeout
        entry = "there is no spelling error here"
        spelling_check = Evidence::SpellingCheck.new(entry)

        expect {spelling_check.feedback_object}.to raise_error(Evidence::SpellingCheck::BingTimeoutError, "request took longer than 5 seconds")
      end

      it 'should raise error if the Bing API request times out with a Net::ReadTimeout' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_raise(Net::ReadTimeout)
        entry = "there is no spelling error here"
        spelling_check = Evidence::SpellingCheck.new(entry)

        expect {spelling_check.feedback_object}.to raise_error(Evidence::SpellingCheck::BingTimeoutError, "request took longer than 5 seconds")
      end


      it 'should return appropriate error if the endpoint returns an error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 200, :body => { :error => ({ :message => "There's a problem here" }) }.to_json, :headers => ({}))
        entry = "there is no spelling error here"
        spelling_check = Evidence::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(spelling_check.error).to(be_truthy)
      end
    end

    context 'should #non_optimal_feedback_string' do

      it 'should use the fallback feedback if there is no spelling Rule with feedback' do
        spelling_check = Evidence::SpellingCheck.new("")
        expect(Evidence::SpellingCheck::FALLBACK_INCORRECT_FEEDBACK).to(eq(spelling_check.non_optimal_feedback_string))
      end

      it 'should use the feedback from the spelling rule if it is available' do
        rule = create(:evidence_rule, :rule_type => (Evidence::Rule::TYPE_SPELLING))
        feedback = create(:evidence_feedback, :rule => rule)
        spelling_check = Evidence::SpellingCheck.new("")
        expect(feedback.text).to(eq(spelling_check.non_optimal_feedback_string))
      end

      it 'should use the higher ordered feedback if lower ordered feedback is in feedback_history' do
        rule = create(:evidence_rule, :rule_type => (Evidence::Rule::TYPE_SPELLING))
        feedback = create(:evidence_feedback, :text => 'First feedback', :rule => rule, :order => 1)
        feedback2 = create(:evidence_feedback, :text => 'Second feedback', :rule => rule, :order => 2)
        feedback_history = [{
          'feedback_type' => feedback.rule.rule_type,
          'feedback' => feedback.text
        }]
        spelling_check = Evidence::SpellingCheck.new("", feedback_history)
        expect(feedback2.text).to(eq(spelling_check.non_optimal_feedback_string))
      end

      it 'should use the highest ordered feedback if all feedback options are in feedback_history' do
        rule = create(:evidence_rule, :rule_type => (Evidence::Rule::TYPE_SPELLING))
        feedback = create(:evidence_feedback, :text => 'First feedback', :rule => rule, :order => 1)
        feedback2 = create(:evidence_feedback, :text => 'Second feedback', :rule => rule, :order => 2)
        feedback_history = [{
          'feedback_type' => feedback.rule.rule_type,
          'feedback' => feedback.text
        },{
          'feedback_type' => feedback2.rule.rule_type,
          'feedback' => feedback2.text
        }]
        spelling_check = Evidence::SpellingCheck.new("", feedback_history)
        expect(feedback2.text).to(eq(spelling_check.non_optimal_feedback_string))
      end
    end

    context 'should handle appropriate Bing API errors' do
      it 'should raise exception if the endpoint returns a rate-limit error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 429, :body => { :error => ({ :message => "There's a problem here" }) }.to_json, :headers => ({}))
        entry = "there is no spelling error here"
        spelling_check = Evidence::SpellingCheck.new(entry)
        expect { spelling_check.feedback_object }.to raise_error(Evidence::SpellingCheck::BingRateLimitException)
      end
    end
  end
end
