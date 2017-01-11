class FastAssignWorker
  include Sidekiq::Worker
  include Units

  def unit_with_same_name(id)
    @unit_template  = UnitTemplate.find(id)
    @unit = units_with_same_name_by_current_user(unit_template.name).first
  end

  def perform(current_user, unit_template_id)
    logger.debug "Here's some info: #{hash.inspect}"
    logger.debug "ID: #{unit_template_id}"
    if units_with_same_name(unit_template_id)
      Units::Updater.fast_assign_unit_template(current_user.id, @unit_template, @unit)
    else
      Units::Creator.fast_assign_unit_template(current_user, unit_template_id)
    end
  end

end
