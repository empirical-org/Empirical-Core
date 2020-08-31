class FastAssignWorker
  include Sidekiq::Worker
  include Units
  sidekiq_options queue: SidekiqQueue::CRITICAL


  def unit_with_same_name(unit_template_id, teacher_id)
    @unit_template  = UnitTemplate.find(unit_template_id)
    @unit = units_with_same_name_by_current_user(@unit_template.name, teacher_id).first
  end

  def perform(teacher_id, unit_template_id)
    if unit_with_same_name(unit_template_id, teacher_id)
      Units::Updater.fast_assign_unit_template(teacher_id, @unit_template, @unit.id)
    else
      Units::Creator.fast_assign_unit_template(teacher_id, unit_template_id)
    end
  end

end
