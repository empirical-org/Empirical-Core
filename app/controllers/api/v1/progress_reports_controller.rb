class Api::V1::ProgressReportsController < Api::ApiController
  include QuillAuthentication
  before_action :authorize_classroom_and_student_teacher_relationship!, only: [:student_overview_data]

  def activities_scores_by_classroom_data
    classroom_ids = current_user.classrooms_i_teach.map(&:id)
    data = ProgressReports::ActivitiesScoresByClassroom.results(classroom_ids)
    render json: { data: data }
  end

  def district_activity_scores
    if current_user.admin?
      data = ProgressReports::DistrictActivityScores.new(current_user.id).results
      render json: { data: data }
    end
  end

  def district_concept_reports
    if current_user.admin?
      data = ProgressReports::DistrictConceptReports.new(current_user.id).results
      render json: { data: data }
    end
  end

  def district_standards_reports
    if current_user.admin?
      data = ProgressReports::DistrictStandardsReports.new(current_user.id).results
      render json: { data: data }
    end
  end

  def student_overview_data
    student        = User.find(params[:student_id].to_i)
    report_data    = ProgressReports::StudentOverview.results(params[:classroom_id].to_i, params[:student_id].to_i)
    classroom_name = Classroom.find(params[:classroom_id].to_i).name
    data = {
      report_data: report_data,
      student_data: {
        name: student.name,
        id: student.id,
        last_active: student.last_active
      },
      classroom_name: classroom_name
    }

    render json: data
  end

  private

  def authorize_classroom_and_student_teacher_relationship!
    classroom_teacher!(params[:classroom_id].to_i)
    if !StudentsClassrooms.find_by(classroom_id: params[:classroom_id].to_i, student_id: params[:student_id].to_i)
      auth_failed
    end
  end
end
