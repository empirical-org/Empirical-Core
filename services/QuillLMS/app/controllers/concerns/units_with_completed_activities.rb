module UnitsWithCompletedActivities
  extend ActiveSupport::Concern

  def units_with_completed_activities(cus)
    all_assigned_units = cus.group_by{|cu| cu.unit_id}
    relevant_unit_ids = []
    all_assigned_units.each do |unit_id, classroom_units|
      activity_ids = Unit.find(unit_id)&.unit_activities&.map(&:activity_id).flatten
      relevant_unit_ids << unit_id if classroom_units.select { |cu| ActivitySession.has_a_completed_session?(cu.id, activity_ids) }.any?
    end
    Unit.where(id: relevant_unit_ids)
  end

end
