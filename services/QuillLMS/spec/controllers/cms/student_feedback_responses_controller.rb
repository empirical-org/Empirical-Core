require 'rails_helper'

describe StudentFeedbackResponsesController do
  describe '#create' do
    it 'creates a new student_feedback_response' do
      post :create, {
        student_feedback_response: {
          question: "What’s a part of your culture, upbringing, or background you’d like your classmates to learn more about in a Quill activity?",
          response: "I would like for them to learn about how Philadelphia is the greatest city on earth.",
          grade_levels: ["University", "9"],
        }
      }
      parsed_response = JSON.parse(response.body)
      id = parsed_response["student_feedback_response"]["id"]
      expect(id).to be
      expect(StudentFeedbackResponse.find_by_id(id)).to be
    end
  end
end
