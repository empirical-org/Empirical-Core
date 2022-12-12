# frozen_string_literal: true

class UnitActivitiesSaver < ApplicationService
  attr_reader :activities_data, :new_unit_activities_data, :unit_id

  def initialize(activities_data, unit_id)
    @new_unit_activities_data = []
    @unit_id = unit_id

    @activities_data =
      activities_data
        .map(&:symbolize_keys)
        .select { |activity_data| activity_data[:id] }
        .uniq { |activity_data| activity_data[:id].to_i }
  end

  def run
    update_existing_unit_activities_and_aggregate_new_unit_activities_data
    bulk_create_unit_activities
  end

  private def bulk_create_unit_activities
    new_unit_activities_data.each do |new_ua_data|
      ua = UnitActivity.new
      ua.save_new_attributes_and_adjust_dates!(new_ua_data)
    end
  end

  private def update_existing_unit_activities_and_aggregate_new_unit_activities_data
    activities_data.each.with_index(1) do |activity_data, order_number|
      activity_id = activity_data[:id].to_i
      due_date = activity_data[:due_date]
      publish_date = activity_data[:publish_date]
      unit_activity = unit_activities.find { |ua| ua.activity_id == activity_id }

      if unit_activity
        unit_activity.save_new_attributes_and_adjust_dates!(
          due_date: due_date || unit_activity.due_date,
          publish_date: publish_date || unit_activity.publish_date,
          order_number: order_number,
          visible: true
        )
      else
        new_unit_activities_data.push(
          activity_id: activity_id,
          due_date: due_date,
          publish_date: publish_date,
          order_number: order_number,
          unit_id: unit_id
        )
      end
    end
  end

  private def unit_activities
    @unit_activities ||= UnitActivity.where(unit_id: unit_id)
  end
end
