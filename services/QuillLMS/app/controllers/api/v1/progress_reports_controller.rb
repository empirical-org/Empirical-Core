# frozen_string_literal: true

class Api::V1::ProgressReportsController < Api::ApiController
  before_action :authorize!, only: :student_overview_data

  def activities_scores_by_classroom_data
    classroom_ids = current_user&.classrooms_i_teach&.map(&:id)
    return render json: { data: [] } if classroom_ids.empty?

    data = current_user.all_classrooms_cache(key: 'api.v1.progress_reports.activities_scores_by_classroom_data') do
      ProgressReports::ActivitiesScoresByClassroom.results(classroom_ids, current_user.time_zone)
    end

    render json: { data: data }
  end

  def district_activity_scores
    return unless current_user&.admin?

    serialized_district_activity_scores_json = $redis.get("#{SchoolsAdmins::DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM}#{current_user.id}")
    if serialized_district_activity_scores_json
      serialized_district_activity_scores = JSON.parse(serialized_district_activity_scores_json)
    end
    if serialized_district_activity_scores.nil?
      FindDistrictActivityScoresWorker.perform_async(current_user.id)
      render json: { id: current_user.id }
    else
      render json: { data: serialized_district_activity_scores }
    end
  end

  def district_concept_reports
    return unless current_user&.admin?

    serialized_district_concept_reports_json = $redis.get("#{SchoolsAdmins::DISTRICT_CONCEPT_REPORTS_CACHE_KEY_STEM}#{current_user.id}")
    if serialized_district_concept_reports_json
      serialized_district_concept_reports = JSON.parse(serialized_district_concept_reports_json)
    end
    if serialized_district_concept_reports.nil?
      FindDistrictConceptReportsWorker.perform_async(current_user.id)
      render json: { id: current_user.id }
    else
      render json: { data: serialized_district_concept_reports }
    end
  end

  def district_standards_reports
    return unless current_user&.admin?

    is_fremium_view = params && params[:freemium] ? true : false
    cache_key = is_fremium_view ? SchoolsAdmins::FREEMIUM_DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM : SchoolsAdmins::DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM
    data = $redis.get("#{cache_key}#{current_user.id}")

    if data.nil?
      FindDistrictStandardsReportsWorker.perform_async(current_user.id, is_fremium_view)
      render json: { id: current_user.id }
    else
      render json: { data: JSON.parse(data) }
    end
  end

  def student_overview_data
    render json: fetch_student_overview_data_cache
  end

  private def fetch_student_overview_data_cache
    classroom = Classroom.find(params[:classroom_id].to_i)
    cache_groups = {
      student_id: params[:student_id]
    }
    current_user.classroom_cache(classroom, key: 'api.v1.progress_reports.student_overview_data', groups: cache_groups) do
      student        = User.find(params[:student_id].to_i)
      report_data    = ProgressReports::StudentOverview.results(params[:classroom_id].to_i, params[:student_id].to_i)
      {
        report_data: report_data,
        student_data: {
          name: student.name,
          id: student.id,
          last_active: student.last_active
        },
        classroom_name: classroom.name
      }
    end
  end

  private def authorize!
    return if current_user&.admin? && authorize_admin

    authorize_classroom_and_student_teacher_relationship!
  end

  private def authorize_admin
    teacher_ids = Classroom.find(params[:classroom_id].to_i).teachers.pluck(:id)
    teachers = User.joins(administered_schools: :schools_users)
      .where('schools_users.user_id IN (?)', teacher_ids)
      .where(id: current_user.id)

    teachers.count > 0
  end

  private def authorize_classroom_and_student_teacher_relationship!
    classroom_id = params[:classroom_id].to_i
    student_id   = params[:student_id].to_i
    student_classrooms = StudentsClassrooms.find_by(
      classroom_id: classroom_id,
      student_id: student_id
    )
    classroom_teacher!(classroom_id)
    return if performed?

    auth_failed unless student_classrooms
  end
end
