class FastAssignWorker
  include Sidekiq::Worker
  include Units

  def spawned_unit(unit_template_id, teacher_id)
    @unit_template  = UnitTemplate.find(unit_template_id)
    # we should no longer need to check units_with_same_name_by_current_user,
    # but leaving it in for now in case the rake task to backdate creation of unit template units
    # missed some name variation
    @unit = @unit_template.units.find_by(user_id: teacher_id) || units_with_same_name_by_current_user(@unit_template.name, teacher_id).first
  end

  def perform(teacher_id, unit_template_id)
    logger.debug "Here's some info: #{hash.inspect}"
    logger.debug "ID: #{unit_template_id}"
    if spawned_unit(unit_template_id, teacher_id)
      Units::Updater.fast_assign_unit_template(teacher_id, @unit_template, @unit)
    else
      Units::Creator.fast_assign_unit_template(teacher_id, @unit_template)
    end
  end

end
