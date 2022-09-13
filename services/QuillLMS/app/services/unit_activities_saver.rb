# frozen_string_literal: true

class UnitActivitiesSaver < ApplicationService
  attr_reader :activities_data, :new_unit_activities_data, :unit_id

  def initialize(activities_data, unit_id)
    @new_unit_activities_data = []
    @unit_id = unit_id

    @activities_data =
      activities_data
        .map(&:symbolize_keys)
        .select { |activity_data| activity_data.key?(:id) }
        .reject { |activity_data| activity_data[:id].nil? }
        .uniq { |activity_data| activity_data[:id] }
  end

  def run
    update_existing_unit_activities_and_aggregate_new_unit_activities_data
    bulk_create_unit_activities
  end

  private def bulk_create_unit_activities
    UnitActivity.create(new_unit_activities_data)
  end

  private def update_existing_unit_activities_and_aggregate_new_unit_activities_data
    activities_data.each.with_index(1) do |activity_data, order_number|
      activity_id = activity_data[:id].to_i
      due_date = activity_data[:due_date]
      unit_activity = unit_activities.find { |ua| ua.activity_id == activity_id}

      if unit_activity
        unit_activity.update!(
          due_date: due_date || unit_activity.due_date,
          order_number: order_number,
          visible: true
        )
      else
        new_unit_activities_data.push(
          activity_id: activity_id,
          due_date: due_date,
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
