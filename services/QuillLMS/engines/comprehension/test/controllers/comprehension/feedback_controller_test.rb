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

      should "return successfully when there is plagiarism" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "bla bla bla do not plagiarize this text please", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
      end

      should "return successfully when there is plagiarism and ignore punctuation" do
        prompt = create(:comprehension_prompt)
        post 'plagiarism', entry: "bla bla bla do not plagiarize,,,,.. this text please", prompt_id: prompt.id, session_id: 1, previous_feedback: []
        parsed_response = JSON.parse(response.body)
        assert_equal parsed_response["optimal"], false
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