class Api::V1::ProgressReportsController < Api::ApiController
  include QuillAuthentication
  before_action :authorize_classroom_and_student_teacher_relationship!, only: [:student_overview_data]

  def activities_scores_by_classroom_data
    render json: {data: ProgressReports::ActivitiesScoresByClassroom.results(current_user.classrooms_i_teach.map(&:id))}
  end

  def student_overview_data
    student = User.find(params[:student_id].to_i)
    render json: {report_data: ProgressReports::StudentOverview.results(params[:classroom_id].to_i, params[:student_id].to_i),
                  student_data: {name: student.name, id: student.id, last_active: student.last_active}, classroom_name: Classroom.find(params[:classroom_id].to_i).name}
  end

  private

  def authorize_classroom_and_student_teacher_relationship!
    classroom_teacher!(params[:classroom_id].to_i)
    if !StudentsClassrooms.find_by(classroom_id: params[:classroom_id].to_i, student_id: params[:student_id].to_i)
      auth_failed
    end
  end


end
