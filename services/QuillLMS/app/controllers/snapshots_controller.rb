# frozen_string_literal: true

class SnapshotsController < ApplicationController
  GRADE_OPTIONS = [
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

  before_action :validate_request, only: [:count]
  before_action :authorize_request, only: [:count]

  def count
    previous_start, current_start, current_end = Snapshots::Timeframes.calculate_timeframes(snapshot_params[:timeframe],
      snapshot_params[:timeframe_custom_start],
      snapshot_params[:timeframe_custom_end])
    cache_key = cache_key_for_timeframe(previous_start, current_start, current_end)
    response = Rails.cache.read(cache_key)

    return render json: response if response


    Snapshots::CacheSnapshotCountWorker.perform_async(cache_key,
      snapshot_params[:query],
      current_user.id,
      {
        name: snapshot_params[:timeframe],
        previous_start: previous_start,
        current_start: current_start,
        current_end: current_end
      },
      snapshot_params[:school_ids],
      snapshot_params[:grades])

    render json: { message: 'Generating snapshot' }
  end

  def options
    render json: {
      timeframes: Snapshots::Timeframes.frontend_options,
      schools: Snapshots::SchoolsOptionsQuery.run(current_user.id),
      grades: GRADE_OPTIONS
    }
  end

  private def validate_request
    return render json: { error: 'timeframe must be present and valid' }, status: 400 unless timeframe_param_valid?

    return render json: { error: 'school_ids are required' }, status: 400 unless school_ids_param_valid?
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

  private def cache_key_for_timeframe(previous_start, current_start, current_end)

    Snapshots::CacheKeys.generate_key(snapshots_params[:query],
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
end
