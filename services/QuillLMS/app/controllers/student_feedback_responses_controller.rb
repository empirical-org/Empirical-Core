class StudentFeedbackResponsesController < ApplicationController

  def create
    new_student_feedback_response = StudentFeedbackResponse.create(student_feedback_response_params)
    render json: { student_feedback_response: new_student_feedback_response }
  end

  private def student_feedback_response_params
    params.require(:student_feedback_response).permit(
      :question,
      :response,
      grade_levels: []
    )
  end

end
