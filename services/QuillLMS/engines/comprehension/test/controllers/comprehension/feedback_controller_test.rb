require 'test_helper'

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
  end
end
