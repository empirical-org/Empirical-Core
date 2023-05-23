# frozen_string_literal: true

class SnapshotsController < ApplicationController
  DEFAULT_TIMEFRAME = 'last-30-days'

  TIMEFRAMES = [
    {
      value: 'last-30-days',
      name: 'Last 30 days',
      previous_start: proc { DateTime.current - 60.days },
      current_start: proc { DateTime.current - 30.days },
      current_end: proc { DateTime.current }
    }, {
      value: 'last-90-days',
      name: 'Last 90 days',
      previous_start: proc { DateTime.current - 180.days },
      current_start: proc { DateTime.current - 90.days },
      current_end: proc { DateTime.current },
    }, {
      value: 'this-month',
      name: 'This month',
      previous_start: proc { DateTime.current.beginning_of_month - 1.month },
      current_start: proc { DateTime.current.beginning_of_month },
      current_end: proc { DateTime.current },
    }, {
      value: 'last-month',
      name: 'This month',
      previous_start: proc { DateTime.current.beginning_of_month - 2.months },
      current_start: proc { DateTime.current.beginning_of_month - 1.month },
      current_end: proc { DateTime.current },
    }, {
      value: 'this-year',
      name: 'This year',
      previous_start: proc { DateTime.current.beginning_of_year - 1.year },
      current_start: proc { DateTime.current.beginning_of_year },
      current_end: proc { DateTime.current },
    }, {
      value: 'last-year',
      name: 'Last year',
      previous_start: proc { DateTime.current.beginning_of_year - 2.years },
      current_start: proc { DateTime.current.beginning_of_year - 1.year },
      current_end: proc { DateTime.current },
    }, {
      value: 'all-time',
      name: 'All time',
      previous_start: proc { DateTime.current.beginning_of_year - 2.years },
      current_start: proc { DateTime.new(2010,1,1) }, # This is well before anydata exists in our system, so works for "all time"
      current_end: proc { DateTime.current },
    }, {
      value: Snapshots::CacheKeys::CUSTOM_TIMEFRAME_NAME,
      name: 'Custom',
      previous_start: :custom_previous_start,
      current_start: :custom_current_start,
      current_end: :custom_current_end
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

  def count
    response = Rails.cache.read(cache_key)

    return render json: response if response

    previous_timeframe_start, current_timeframe_start, timeframe_end = calculate_timeframes

    Snapshots::CacheSnapshotCountWorker.perform_async(snapshot_params[:query],
      current_user.id,
      snapshot_params[:timeframe],
      previous_timeframe_start,
      current_timeframe_start,
      timeframe_end,
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

  private def cache_key
    Snapshots::CacheKeys.generate_key(snapshot_params[:query],
      current_user.id,
      {
        name: snapshot_params[:timeframe_name],
        custom_start: snapshot_params[:timeframe_custom_start],
        custom_end: snapshot_params[:timeframe_custom_end]
      },
      snapshot_params[:school_ids],
      snapshot_params[:grades])
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

    return [send(timeframe[:previous_start]),
     send(timeframe[:current_start]),
     send(timeframe[:current_end])] if snapshot_params[:timeframe] == 'custom'

    [timeframe[:previous_start].call,
     timeframe[:current_start].call,
     timeframe[:current_end].call]
  end

  private def custom_previous_start
    timeframe_length = custom_current_end - custom_current_start
    custom_current_start - timeframe_length
  end

  private def custom_current_start
    DateTime.parse(snapshot_params[:timeframe_custom_start])
  end

  private def custom_current_end
    DateTime.parse(snapshot_params[:timeframe_custom_end])
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
