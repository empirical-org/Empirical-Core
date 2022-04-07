# frozen_string_literal: true

class TimeTrackingCleaner < ApplicationService
  OUTLIER_MULTIPLIER = 40

  attr_reader :time_tracking, :data_params

  def initialize(data_params)
    @data_params = data_params
    @time_tracking = data_params&.fetch(ActivitySession::TIME_TRACKING_KEY, nil)
  end

  def run
    return data_params unless time_tracking.respond_to?(:values)
    return data_params if outliers.empty?

    data_params.merge(
      ActivitySession::TIME_TRACKING_KEY => cleaned_time_tracking,
      ActivitySession::TIME_TRACKING_EDITS_KEY => outliers
    )
  end

  def cleaned_time_tracking
    time_tracking.merge(outliers.transform_values {|_| median_value})
  end

  def outliers
    @outliers ||= time_tracking.select {|_, v| v > outlier_threshold}
  end

  private def median_value
    @median_value ||= time_tracking.values.compact.median
  end

  private def outlier_threshold
    @outlier_threshold ||= median_value * OUTLIER_MULTIPLIER
  end
end
