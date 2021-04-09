require 'test_helper'
require 'webmock/minitest'

module Comprehension
  class FeedbackControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
      @prompt = create(:comprehension_prompt)
      @rule = create(:comprehension_rule, rule_type: 'plagiarism')
      @rule_regex = create(:comprehension_rule, rule_type: 'rules-based-1')
      create(:comprehension_regex_rule, regex_text: '^test', rule: @rule_regex)
      create(:comprehension_prompts_rule, rule: @rule, prompt: @prompt)
      create(:comprehension_prompts_rule, rule: @rule_regex, prompt: @prompt)
      create(:comprehension_plagiarism_text, text: "do not plagiarize this text please", rule: @rule)
      @first_feedback = create(:comprehension_feedback, text: 'here is our first feedback', rule: @rule, order: 0)
      @second_feedback = create(:comprehension_feedback, text: 'here is our second feedback', rule: @rule, order: 1)
    end

    context "plagiarism" do
      should "return successfully" do
        post 'plagiarism', entry: "No plagiarism here.", prompt_id: @prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], true
      end

      should "return 404 if prompt id does not exist" do
        post 'plagiarism', entry: "No plagiarism here.", prompt_id: 100, session_id: 1, previous_feedback: []
        assert_equal response.status, 404
      end

      should "return successfully when there is plagiarism" do
        post 'plagiarism', entry: "bla bla bla do not plagiarize this text please", prompt_id: @prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
        assert_equal parsed_response["highlight"][0]["text"], "do not plagiarize this text please"
        assert_equal parsed_response["highlight"][1]["text"], "do not plagiarize this text please"
        assert_equal parsed_response["feedback"], @first_feedback.text

        post 'plagiarism', entry: "bla bla bla do not plagiarize this text please", prompt_id: @prompt.id, session_id: 1, previous_feedback: [parsed_response]
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
        assert_equal parsed_response["feedback"], @second_feedback.text
      end
    end

    context "regex" do
      should "return successfully" do
        post 'regex', :rule_type => @rule_regex.rule_type, entry: "no regex problems here.", prompt_id: @prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], true
      end

      should "return 404 if prompt id does not exist" do
        post 'regex', :rule_type => @rule_regex.rule_type, entry: "no regex problems here.", prompt_id: 100, session_id: 1, previous_feedback: []
        assert_equal response.status, 404
      end

      should "return 404 if rule_type does not exist" do
        post 'regex', :rule_type => "not-rule-type", entry: "no regex problems here.", prompt_id: 100, session_id: 1, previous_feedback: []
        assert_equal response.status, 404
      end

      should "return successfully when there is regex feedback" do
        post 'regex', :rule_type => @rule_regex.rule_type, entry: "test regex response", prompt_id: @prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
      end
    end

    context "#automl" do
      should 'return feedback payloads based on the lib matched_rule value' do
        entry = 'entry'

        AutomlCheck.stub_any_instance(:matched_rule, @rule) do
          Rule.stub_any_instance(:determine_feedback_from_history, @first_feedback) do
            post 'automl', entry: entry, prompt_id: @prompt.id, session_id: 1, previous_feedback: []

            parsed_response = JSON.parse(response.body)
            assert_equal parsed_response, {
              feedback: @first_feedback.text,
              feedback_type: 'autoML',
              optimal: @rule.optimal,
              response_id: '',
              entry: entry,
              concept_uid: @rule.concept_uid,
              rule_uid: @rule.uid,
              highlight: []
            }.stringify_keys
          end
        end
      end
    end

    context '#spelling' do
      should 'return correct spelling feedback when endpoint returns 200' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=test%20spelin%20error")
        .to_return(status: 200, body: {flaggedTokens: [{token: 'spelin'}]}.to_json, headers: {})

        post 'spelling', entry: "test spelin error", prompt_id: @prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal response.status, 200
        assert_equal parsed_response["optimal"], false
      end

      should 'return 500 if there is an error on the bing API' do
        stub_request(:get, "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck?mode=proof&text=there%20is%20no%20spelling%20error%20here")
        .to_return(status: 200, body: {error: {message: "There's a problem here"}}.to_json, headers: {})

        post 'spelling', entry: "there is no spelling error here", prompt_id: @prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal response.status, 500
        assert_equal parsed_response["error"], "There's a problem here"
      end
    end
  end
end
