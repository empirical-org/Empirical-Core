# frozen_string_literal: true

class UnitActivitiesSaver < ApplicationService
  attr_reader :activities_data, :unit_id

  def initialize(activities_data, unit_id)
    @unit_id = unit_id

    @activities_data =
      activities_data
        .map(&:symbolize_keys)
        .select { |activity_data| activity_data[:id] }
        .uniq { |activity_data| activity_data[:id].to_i }
  end

  def run
    save_unit_activities
  end

  private def save_unit_activities
    activities_data.each.with_index(1) do |activity_data, order_number|
      activity_id = activity_data[:id].to_i
      due_date = activity_data[:due_date]
      publish_date = activity_data[:publish_date]

      begin
        unit_activity = UnitActivity.find_by(unit_id: unit_id, activity_id: activity_id)

        if unit_activity
          unit_activity.save_new_attributes_and_adjust_dates!(
            due_date: due_date || unit_activity.due_date,
            publish_date: publish_date || unit_activity.publish_date,
            order_number: order_number,
            visible: true
          )
        else
          UnitActivity.create!(
            activity_id: activity_id,
            due_date: due_date,
            publish_date: publish_date,
            order_number: order_number,
            unit_id: unit_id
          )
        end
      rescue ActiveRecord::RecordNotUnique
        retry
      end
    end
  end
end
