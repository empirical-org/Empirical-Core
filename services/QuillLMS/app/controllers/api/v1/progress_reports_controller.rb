class Api::V1::ProgressReportsController < Api::ApiController
  include QuillAuthentication
  before_action :authorize!, only: :student_overview_data

  def activities_scores_by_classroom_data
    classroom_ids = current_user.classrooms_i_teach.map(&:id)
    data = ProgressReports::ActivitiesScoresByClassroom.results(classroom_ids)
    render json: { data: data }
  end

  def real_time_data
    student_ids = current_user.students.map(&:id)
    puts student_ids
    data = ProgressReports::RealTime.results(student_ids)
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

  def authorize!
    return if current_user.admin? && authorize_admin

    authorize_classroom_and_student_teacher_relationship!
  end

  def authorize_admin
    teacher_ids = Classroom.find(params[:classroom_id].to_i).teachers.pluck(:id)
    teachers = User.joins(administered_schools: :schools_users)
      .where('schools_users.user_id = ?', teacher_ids)
      .where(id: current_user.id)

    return teachers.count > 0
  end

  def authorize_classroom_and_student_teacher_relationship!
    classroom_id = params[:classroom_id].to_i
    student_id   = params[:student_id].to_i
    student_classrooms = StudentsClassrooms.find_by(
      classroom_id: classroom_id,
      student_id: student_id
    )
    classroom_teacher!(classroom_id)
    auth_failed unless student_classrooms
  end
end
