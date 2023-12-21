# frozen_string_literal: true

class AdminDiagnosticReportsController < ApplicationController
  CACHE_REPORT_NAME = 'admin-diagnostic-overview'
  WORKERS_FOR_ACTIONS = {
    "report" => AdminDiagnosticReports::DiagnosticOverviewWorker
  }

  before_action :set_query
  before_action :validate_request
  before_action :authorize_request

  def report
    render json: retrieve_cache_or_enqueue_worker(WORKERS_FOR_ACTIONS[action_name])
  end

  private def set_query
    @query = permitted_params[:query]
    @group_by = permitted_params[:group_by]
  end

  private def validate_request
    return render json: { error: 'timeframe must be present and valid' }, status: 400 unless timeframe_param_valid?

    return render json: { error: 'school_ids are required' }, status: 400 unless school_ids_param_valid?

    return render json: { error: 'unrecognized query type for this endpoint' }, status: 400 unless action_name_and_query_valid?
  end

  private def timeframe_param_valid?
    Snapshots::Timeframes.find_timeframe(permitted_params[:timeframe]).present?
  end

  private def school_ids_param_valid?
    permitted_params[:school_ids]&.any?
  end

  private def action_name_and_query_valid?
    WORKERS_FOR_ACTIONS[action_name]::QUERIES.keys.include?(@query)
  end


  private def authorize_request
    schools_user_admins = current_user.administered_schools.pluck(:id)

    return if permitted_params[:school_ids]&.all? { |param_id| schools_user_admins.include?(param_id.to_i) }

    return render json: { error: 'user is not authorized for all specified schools' }, status: 403
  end

  private def retrieve_cache_or_enqueue_worker(worker)
    timeframe_start, timeframe_end = Snapshots::Timeframes.calculate_timeframes(
      permitted_params[:timeframe],
      custom_start: permitted_params[:timeframe_custom_start],
      custom_end: permitted_params[:timeframe_custom_end])
    cache_key = cache_key_for_timeframe(permitted_params[:timeframe], timeframe_start, timeframe_end)
    response = Rails.cache.read(cache_key)

    return { results: response } if response

    worker.perform_async(cache_key,
      @query,
      @group_by,
      current_user.id,
      {
        name: permitted_params[:timeframe],
        timeframe_start: timeframe_start,
        timeframe_end: timeframe_end
      },
      permitted_params[:school_ids],
      {
        grades: permitted_params[:grades],
        teacher_ids: permitted_params[:teacher_ids],
        classroom_ids: permitted_params[:classroom_ids]
      })

    { message: 'Generating snapshot' }
  end

  private def cache_key_for_timeframe(timeframe_name, timeframe_start, timeframe_end)

    Snapshots::CacheKeys.generate_key(CACHE_REPORT_NAME,
      "#{@query}-#{@group_by}",
      timeframe_name,
      timeframe_start,
      timeframe_end,
      permitted_params.fetch(:school_ids, []),
      additional_filters: {
        grades: permitted_params.fetch(:grades, []),
        teacher_ids: permitted_params.fetch(:teacher_ids, []),
        classroom_ids: permitted_params.fetch(:classroom_ids, [])
      })
  end

  private def permitted_params
    params.permit(:query,
      :group_by,
      :timeframe,
      :timeframe_custom_start,
      :timeframe_custom_end,
      school_ids: [],
      grades: [],
      teacher_ids: [],
      classroom_ids: [])
  end
end
