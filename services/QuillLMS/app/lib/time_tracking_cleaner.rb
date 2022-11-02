# frozen_string_literal: true

class TimeTrackingCleaner < ApplicationService
  OUTLIER_MULTIPLIER = 40
  MAX_TIME_SECTION = 10.minutes.to_i

  # There are some keys that it doesn't make sense to use the median as a backfill
  # So skipping them for now, until we have a more robust solution.
  IGNORE_MEDIAN_KEYS = ['proofreading_the_passage']

  attr_reader :time_tracking, :data_params, :time_tracking_edits

  def initialize(data_params)
    @data_params = data_params
    @time_tracking = data_params&.fetch(ActivitySession::TIME_TRACKING_KEY, nil)
    @time_tracking_edits = data_params&.fetch(ActivitySession::TIME_TRACKING_EDITS_KEY, {})
  end

  # Two step process:
  # 1. Replace outlier values with the list's median value if they are 40x larger than the median
  # 2. Cap other values at 10 minutes
  # Keep track of original data in data['time_tracking_edits']
  # This is a backstop against a bug in the frontend time tracking with resumed sessions
  def run
    return data_params unless time_tracking.respond_to?(:values)
    return data_params if median_outliers.empty? && max_outliers.empty?

    data_params.merge(
      ActivitySession::TIME_TRACKING_KEY => time_tracking_outliers_replaced,
      ActivitySession::TIME_TRACKING_EDITS_KEY => time_tracking_edits_updated
    )
  end

  private def time_tracking_outliers_replaced
    time_tracking
      .merge(median_outliers.transform_values {|_| median_value})
      .merge(max_outliers.transform_values {|_| MAX_TIME_SECTION})
  end

  private def time_tracking_edits_updated
    time_tracking_edits
      .merge(median_outliers)
      .merge(max_outliers)
  end

  private def max_outliers
    @max_outliers ||= begin
      time_tracking
        .except(*median_outliers.keys)
        .select {|_,v| v > MAX_TIME_SECTION }
    end
  end

  private def median_outliers
    @median_outliers ||= begin
      time_tracking
        .except(*IGNORE_MEDIAN_KEYS)
        .select {|_, v| v > median_outlier_threshold}
    end
  end

  private def median_value
    @median_value ||= time_tracking.values.compact.median.to_i
  end

  private def median_outlier_threshold
    @outlier_threshold ||= median_value * OUTLIER_MULTIPLIER
  end
end
