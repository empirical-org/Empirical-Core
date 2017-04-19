class FastAssignWorker
  include Sidekiq::Worker
  include Units

  def spawned_unit(unit_template_id, teacher_id)
    @unit_template  = UnitTemplate.find(unit_template_id)
    @unit = @unit_template.units.where(user_id: teacher_id).first || units_with_same_name_by_current_user(@unit_template.name, teacher_id).first
  end

  def perform(teacher_id, unit_template_id)
    logger.debug "Here's some info: #{hash.inspect}"
    logger.debug "ID: #{unit_template_id}"
    if spawned_unit(unit_template_id, teacher_id)
      Units::Updater.fast_assign_unit_template(teacher_id, @unit_template, @unit)
    else
      Units::Creator.fast_assign_unit_template(teacher_id, unit_template_id)
    end
  end

end
