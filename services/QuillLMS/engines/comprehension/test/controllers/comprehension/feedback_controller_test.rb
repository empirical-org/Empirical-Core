require 'test_helper'

module Comprehension
  class FeedbackControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "plagiarism" do
      should "return successfully" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "No plagiarism here.", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], true
      end

      should "return 404 if prompt id does not exist" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "No plagiarism here.", prompt_id: 100, session_id: 1, previous_feedback: []
        assert_equal response.status, 404
      end

      should "return successfully when there is plagiarism" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "bla bla bla do not plagiarize this text please", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
        assert_equal parsed_response["highlight"][0]["text"], "do not plagiarize this text please"
        assert_equal parsed_response["highlight"][1]["text"], "do not plagiarize this text please"
      end

      should "return successfully when there is plagiarism and ignore punctuation" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "bla bla bla do not plagiarize,,,,.. this text please", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
        assert_equal parsed_response["highlight"][0]["text"], "do not plagiarize this text please"
        assert_equal parsed_response["highlight"][1]["text"], "do not plagiarize,,,,.. this text please"
      end

      should "return successfully when there is plagiarism and ignore punctuation in both passage and entry" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "bla bla bla do not plagiarize,,,,.. this text please! thank,, you.", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
        assert_equal parsed_response["highlight"][0]["text"], "do not plagiarize this text please, thank you"
        assert_equal parsed_response["highlight"][1]["text"], "do not plagiarize,,,,.. this text please! thank,, you"
      end

      should "return second feedback when session has already received plagiarism feedback" do
        prompt = create(:comprehension_prompt, plagiarism_second_feedback: "Second plagiarized attempt.")
        post 'plagiarism', entry: "bla bla bla do not plagiarize this text please", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        post 'plagiarism', entry: "bla bla bla do not plagiarize this text please", prompt_id: prompt.id, session_id: 1, previous_feedback: [parsed_response]
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["feedback"], prompt.plagiarism_second_feedback
      end
    end
  end
end
