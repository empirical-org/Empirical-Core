require 'rails_helper'

require("webmock/minitest")
module Comprehension
  RSpec.describe(SpellingCheck, :type => :model) do

    context 'should #feedback_object' do

      it 'should return appropriate feedback attributes if there is a spelling error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20a%20spelin%20error%20here").to_return(:status => 200, :body => { :flaggedTokens => ([{ :token => "spelin" }]) }.to_json, :headers => ({}))
        entry = "there is a spelin error here"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_falsey)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
        expect(feedback[:highlight][0][:text]).to(be_truthy)
      end

      it 'should return appropriate feedback attributes if there is no spelling error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 200, :body => { :flaggedTokens => ({}) }.to_json, :headers => ({}))
        entry = "there is no spelling error here"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end

      it 'should return appropriate error if the endpoint returns an error' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here").to_return(:status => 200, :body => { :error => ({ :message => "There's a problem here" }) }.to_json, :headers => ({}))
        entry = "there is no spelling error here"
        spelling_check = Comprehension::SpellingCheck.new(entry)
        feedback = spelling_check.feedback_object
        expect(spelling_check.error).to(be_truthy)
      end
    end

    context 'should #non_optimal_feedback_string' do

      it 'should use the fallback feedback if there is no spelling Rule with feedback' do
        spelling_check = Comprehension::SpellingCheck.new("")
        expect(Comprehension::SpellingCheck::FALLBACK_INCORRECT_FEEDBACK).to(eq(spelling_check.non_optimal_feedback_string))
      end

      it 'should use the feedback from the spelling rule if it is available' do
        rule = create(:comprehension_rule, :rule_type => (Comprehension::Rule::TYPE_SPELLING))
        feedback = create(:comprehension_feedback, :rule => rule)
        spelling_check = Comprehension::SpellingCheck.new("")
        expect(feedback.text).to(eq(spelling_check.non_optimal_feedback_string))
      end
    end
  end
end
