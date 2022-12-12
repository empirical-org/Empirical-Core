# frozen_string_literal: true

class FastAssignWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(teacher_id, unit_template_id)
    unit_template  = UnitTemplate.find(unit_template_id)
    unit = User.find(teacher_id).units_with_same_name(unit_template.name).first

    if unit
      Units::Updater.fast_assign_unit_template(teacher_id, unit_template, unit.id)
    else
      Units::Creator.fast_assign_unit_template(teacher_id, unit_template_id)
    end
  end
end
