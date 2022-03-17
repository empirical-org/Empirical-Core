# frozen_string_literal: true

class Api::V1::StudentProblemReportsController < Api::ApiController
  before_action :find_feedback_history, only: [:create]

  def create
    student_problem_report = StudentProblemReport.new({report: student_problem_report_params[:report], optimal: student_problem_report_params[:optimal]})
    student_problem_report.feedback_history_id = @feedback_history&.id
    student_problem_report.save
    render json: student_problem_report.as_json
  end

  private def student_problem_report_params
    params.permit(:activity_session_uid, :entry, :report, :optimal)
  end

  private def find_feedback_history
    feedback_session = FeedbackSession.find_by_activity_session_uid(student_problem_report_params[:activity_session_uid])
    @feedback_history = FeedbackHistory.find_by(entry: student_problem_report_params[:entry], feedback_session_uid: feedback_session&.uid)
  end

end
