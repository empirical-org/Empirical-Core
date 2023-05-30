# frozen_string_literal: true

class SnapshotsController < ApplicationController
  DEFAULT_TIMEFRAME = 'last-30-days'

  TIMEFRAMES = [
    {
      value: 'last-30-days',
      name: 'Last 30 days',
      previous_start: proc { |reference_time| reference_time - 60.days },
      current_start: proc { |reference_time| reference_time - 30.days },
      current_end: proc { |reference_time| reference_time }
    }, {
      value: 'last-90-days',
      name: 'Last 90 days',
      previous_start: proc { |reference_time| reference_time - 180.days },
      current_start: proc { |reference_time| reference_time - 90.days },
      current_end: proc { |reference_time| reference_time },
    }, {
      value: 'this-month',
      name: 'This month',
      previous_start: proc { |reference_time| reference_time.beginning_of_month - (reference_time - reference_time.beginning_of_month) },
      current_start: proc { |reference_time| reference_time.beginning_of_month },
      current_end: proc { |reference_time| reference_time },
    }, {
      value: 'last-month',
      name: 'Last month',
      previous_start: proc { |reference_time| reference_time.beginning_of_month - 2.months },
      current_start: proc { |reference_time| reference_time.beginning_of_month - 1.month },
      current_end: proc { |reference_time| reference_time.beginning_of_month },
    }, {
      value: 'this-year',
      name: 'This year',
      previous_start: proc { |reference_time| reference_time.beginning_of_year - (reference_time - reference_time.beginning_of_year) },
      current_start: proc { |reference_time| reference_time.beginning_of_year },
      current_end: proc { |reference_time| reference_time },
    }, {
      value: 'last-year',
      name: 'Last year',
      previous_start: proc { |reference_time| reference_time.beginning_of_year - 2.years },
      current_start: proc { |reference_time| reference_time.beginning_of_year - 1.year },
      current_end: proc { |reference_time| reference_time.beginning_of_year },
    }, {
      value: 'all-time',
      name: 'All time',
      previous_start: proc { }, # A nil previous start passed to the worker results in the previous-period query being skipped
      current_start: proc { DateTime.new(2010,1,1) }, # This is well before any data exists in our system, so works for "all time"
      current_end: proc { |reference_time| reference_time },
    }, {
      value: 'custom',
      name: 'Custom',
      previous_start: proc { |_, params| DateTime.parse(params[:timeframe_custom_start]) - (DateTime.parse(params[:timeframe_custom_end]) - DateTime.parse(params[:timeframe_custom_start])) },
      current_start: proc { |_, params| DateTime.parse(params[:timeframe_custom_start]) },
      current_end: proc { |_, params| DateTime.parse(params[:timeframe_custom_end]) }
    }
  ]

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

  before_action :validate_request, only: [:count]
  before_action :authorize_request, only: [:count]

  def count
    previous_start, current_start, current_end = calculate_timeframes
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
      timeframes: TIMEFRAMES.map { |timeframe| format_timeframe_option(timeframe) },
      schools: Snapshots::SchoolsOptionsQuery.run(current_user.id),
      grades: GRADE_OPTIONS
    }
  end

  private def validate_request
    return render json: { error: 'timeframe must be present and valid' }, status: 400 unless timeframe_param_valid?

    return render json: { error: 'school_ids are required' }, status: 400 unless school_ids_param_valid?
  end

  private def timeframe_param_valid?
    TIMEFRAMES.map { |t| t[:value] }.include?(snapshot_params[:timeframe])
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

  private def format_timeframe_option(timeframe)
    {
      value: timeframe[:value],
      name: timeframe[:name],
      default: (DEFAULT_TIMEFRAME == timeframe[:value])
    }
  end

  private def find_timeframe(timeframe_value)
    TIMEFRAMES.find { |timeframe| timeframe[:value] == timeframe_value }
  end

  private def calculate_timeframes
    timeframe = find_timeframe(snapshot_params[:timeframe])

    end_of_yesterday = DateTime.current.end_of_day - 1.day

    [
      timeframe[:previous_start].call(end_of_yesterday, snapshot_params),
      timeframe[:current_start].call(end_of_yesterday, snapshot_params),
      timeframe[:current_end].call(end_of_yesterday, snapshot_params)
    ]
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
