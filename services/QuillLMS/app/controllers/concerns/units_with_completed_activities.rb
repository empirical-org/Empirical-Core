module UnitsWithCompletedActivities
  extend ActiveSupport::Concern

  def units_with_completed_activities(cas)
    all_assigned_units = cas.group_by{|ca| ca.unit_id}
    relevant_unit_ids = []
    all_assigned_units.each do |unit_id, classroom_activities|
      relevant_unit_ids << unit_id if classroom_activities.select { |ca| ca.has_a_completed_session? }.any?
    end
    Unit.where(id: relevant_unit_ids)
  end

end
