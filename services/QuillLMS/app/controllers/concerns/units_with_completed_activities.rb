# frozen_string_literal: true

module UnitsWithCompletedActivities
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/CyclomaticComplexity
  def units_with_completed_activities(cus)
    all_assigned_units = cus.group_by{|cu| cu.unit_id}
    relevant_unit_ids = []
    all_assigned_units.each do |unit_id, classroom_units|
      activity_ids = Unit.find(unit_id)&.unit_activities&.map(&:activity_id)&.flatten
      classroom_unit_ids = classroom_units.map(&:id).flatten
      relevant_unit_ids << unit_id if ActivitySession.has_a_completed_session?(activity_ids, classroom_unit_ids)
    end
    Unit.where(id: relevant_unit_ids)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

end
