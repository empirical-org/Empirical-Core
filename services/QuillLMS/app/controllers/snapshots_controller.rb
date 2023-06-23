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
    {value: "Other", name: "Other"}
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
    school_ids = option_params[:school_ids]
    grades = option_params[:grades]
    teacher_ids = option_params[:teacher_ids]

    schools = Schools.where(admins: admin)
    filtered_schools = schools.where(ids: school_ids)
    teachers = filtered_schools.map(&:users).flatten
    filtered_teachers = teachers.where(id: teacher_ids)
    classrooms = filtered_teachers.map(&:classrooms_i_teach).flatten

    render json: {
      timeframes: Snapshots::Timeframes.frontend_options,
      schools: schools,
      grades: GRADE_OPTIONS,
      teachers: teachers,
      classrooms: classrooms
    }
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

    previous_start, current_start, current_end = Snapshots::Timeframes.calculate_timeframes(snapshot_params[:timeframe],
      snapshot_params[:timeframe_custom_start],
      snapshot_params[:timeframe_custom_end])
    cache_key = cache_key_for_timeframe(previous_start, current_start, current_end)
    response = Rails.cache.read(cache_key)

    return { results: response } if response

    worker.perform_async(cache_key,
      @query,
      current_user.id,
      {
        name: snapshot_params[:timeframe],
        previous_start: previous_start,
        current_start: current_start,
        current_end: current_end
      },
      snapshot_params[:school_ids],
      snapshot_params[:grades])

    { message: 'Generating snapshot' }
  end

  private def cache_key_for_timeframe(previous_start, current_start, current_end)

    Snapshots::CacheKeys.generate_key(@query,
      previous_start,
      current_start,
      current_end,
      snapshot_params.fetch(:school_ids, []),
      snapshot_params.fetch(:grades, []))
  end

  private def snapshot_params
    params.permit(:query,
      :timeframe,
      :timeframe_custom_start,
      :timeframe_custom_end,
      school_ids: [],
      grades: [])
  end

  private def option_params
    params.permit(school_ids: [],
      grades: [],
      teacher_ids: [])
  end
end
