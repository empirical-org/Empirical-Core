class AssignRecommendationsWorker
  include Sidekiq::Worker

  def perform(unit_template_id, classroom_id, student_id_array, last, lesson, assign_on_join=false)
    classroom = Classroom.find(classroom_id)
    teacher = classroom.owner
    # try to find by new unit_template_id first, and then old method if that fails
    units = Unit.unscoped.where(unit_template_id: unit_template_id, user_id: teacher.id)
    if units.empty?
      units = Unit.unscoped.where(name: UnitTemplate.find(unit_template_id).name, user_id: teacher.id)
    end
    if units.length > 1
      visible_units = units.where(visible: true)
      unit = visible_units.length > 0 ? visible_units.first : units.order('updated_at DESC').first
    elsif units.length == 1
      unit = units.first
    end
    unit.update(visible: true) if unit && !unit.visible
    ClassroomActivity.unscoped.where(unit_id: unit.id, classroom_id: classroom_id).each { |ca| ca.update(visible: true) } if unit
    classroom_data = {id: classroom_id, student_ids: student_id_array, assign_on_join: assign_on_join}
    if unit
        Units::Updater.assign_unit_template_to_one_class(unit.id, classroom_data, unit_template_id, teacher.id)
    else
        #  TODO: use a find or create for the unit var above.
        #  This way, we can just pass the units creator a unit argument.
        #  The reason we are not doing so at this time, is because the unit creator
        #  Is used elsewhere, and we do not want to overly optimize it for the diagnostic
        Units::Creator.assign_unit_template_to_one_class(teacher.id, unit_template_id, classroom_data)
    end

    analytics = AssignRecommendationsAnalytics.new
    analytics.track(teacher)

    PusherRecommendationCompleted.run(classroom, unit_template_id, lesson) if last
  end
end
