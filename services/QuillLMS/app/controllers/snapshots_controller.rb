# frozen_string_literal: true

class SnapshotsController < ApplicationController
  GRADE_OPTIONS = [
    {value: "Kindergarten", name: "Kindergarten"},
    {value: "1", name: "1st"},
    {value: "2", name: "2nd"},
    {value: "3", name: "3rd"},
    {value: "4", name: "4th"},
    {value: "5", name: "5th"},
    {value: "6", name: "6th"},
    {value: "7", name: "7th"},
    {value: "8", name: "8th"},
    {value: "9", name: "9th"},
    {value: "10", name: "10th"},
    {value: "11", name: "11th"},
    {value: "12", name: "12th"},
    {value: "University", name: "University"},
    {value: "Other", name: "Other"},
    {value: "null", name: "No grade set"}
  ]

  WORKERS_FOR_ACTIONS = {
    "count" => Snapshots::CacheSnapshotCountWorker,
    "top_x" => Snapshots::CacheSnapshotTopXWorker
  }

  before_action :set_query, only: [:count, :top_x]
  before_action :validate_request, only: [:count, :top_x]
  before_action :authorize_request, only: [:count, :top_x]

  def count
    render json: retrieve_cache_or_enqueue_worker(WORKERS_FOR_ACTIONS[action_name])
  end

  def top_x
    render json: retrieve_cache_or_enqueue_worker(WORKERS_FOR_ACTIONS[action_name])
  end

  def options
    render json: {
      timeframes: Snapshots::Timeframes.frontend_options,
      schools: format_option_list(school_options),
      grades: GRADE_OPTIONS,
      teachers: format_option_list(sorted_teacher_options),
      classrooms: format_option_list(classroom_options)
    }
  end

  private def format_option_list(models)
    models.pluck(:id, :name).map { |id, name| {id: id, name: name} }
  end

  private def school_options
    School.joins(:schools_admins)
      .where(schools_admins: {user_id: current_user.id})
  end

  private def filtered_schools
    school_ids = option_params[:school_ids]

    return school_options.where(id: school_ids) if school_ids.present?

    school_options
  end

  private def teacher_options
    grades = option_params[:grades]

    teachers = User.distinct
      .joins(:schools_users)
      .joins(:classrooms_i_teach)
      .where(schools_users: {school_id: filtered_schools.pluck(:id)})

    return teachers.where(classrooms: {grade: grades}) if grades.present?

    teachers
  end

  private def sorted_teacher_options
    # We sort these in Ruby because we want to sort by last name which is a value derived from the database rather than stored in it
    teacher_options.sort_by(&:last_name)
  end

  private def filtered_teachers
    teacher_ids = option_params[:teacher_ids]

    return teacher_options.where(id: teacher_ids) if teacher_ids.present?

    teacher_options
  end

  private def classroom_options
    Classroom.distinct
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: {user_id: filtered_teachers.pluck(:id)})
      .order(:name)
  end

  private def set_query
    @query = snapshot_params[:query]
  end

  private def validate_request
    return render json: { error: 'timeframe must be present and valid' }, status: 400 unless timeframe_param_valid?

    return render json: { error: 'school_ids are required' }, status: 400 unless school_ids_param_valid?

    return render json: { error: 'unrecognized query type for this endpoint' }, status: 400 unless WORKERS_FOR_ACTIONS[action_name]::QUERIES.keys.include?(@query)
  end

  private def timeframe_param_valid?
    Snapshots::Timeframes.find_timeframe(snapshot_params[:timeframe]).present?
  end

  private def school_ids_param_valid?
    snapshot_params[:school_ids]&.any?
  end

  private def authorize_request
    schools_user_admins = current_user.administered_schools.pluck(:id)

    return if snapshot_params[:school_ids]&.all? { |param_id| schools_user_admins.include?(param_id.to_i) }

    return render json: { error: 'user is not authorized for all specified schools' }, status: 403
  end

  private def retrieve_cache_or_enqueue_worker(worker)

    previous_start, previous_end, current_start, current_end = Snapshots::Timeframes.calculate_timeframes(snapshot_params[:timeframe],
      custom_start: snapshot_params[:timeframe_custom_start],
      custom_end: snapshot_params[:timeframe_custom_end])
    cache_key = cache_key_for_timeframe(snapshot_params[:timeframe], current_start, current_end)
    response = Rails.cache.read(cache_key)

    return { results: response } if response

    worker.perform_async(cache_key,
      @query,
      current_user.id,
      {
        name: snapshot_params[:timeframe],
        previous_start: previous_start,
        previous_end: previous_end,
        current_start: current_start,
        current_end: current_end
      },
      snapshot_params[:school_ids],
      {
        grades: snapshot_params[:grades],
        teacher_ids: snapshot_params[:teacher_ids],
        classroom_ids: snapshot_params[:classroom_ids]
      })

    { message: 'Generating snapshot' }
  end

  private def cache_key_for_timeframe(timeframe_name, current_start, current_end)

    Snapshots::CacheKeys.generate_key(@query,
      timeframe_name,
      current_start,
      current_end,
      snapshot_params.fetch(:school_ids, []),
      additional_filters: {
        grades: snapshot_params.fetch(:grades, []),
        teacher_ids: snapshot_params.fetch(:teacher_ids, []),
        classroom_ids: snapshot_params.fetch(:classroom_ids, [])
      })
  end

  private def snapshot_params
    params.permit(:query,
      :timeframe,
      :timeframe_custom_start,
      :timeframe_custom_end,
      school_ids: [],
      grades: [],
      teacher_ids: [],
      classroom_ids: [])
  end

  private def option_params
    params.permit(school_ids: [],
      grades: [],
      teacher_ids: [])
  end
end
