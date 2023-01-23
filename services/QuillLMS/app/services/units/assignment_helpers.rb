# frozen_string_literal: true

module Units::AssignmentHelpers

  def self.find_unit_from_units(units)
    if units.length > 1
      visible_units = units.where(visible: true)
      visible_units.empty? ? units.order('updated_at DESC').first : visible_units.first
    elsif units.length == 1
      units.first
    end
  end

  def self.find_units_from_unit_template_and_teacher(unit_template_id, teacher_id)
    # try to find by new unit_template_id first, and then old method if that fails
    units = Unit.unscoped.where(unit_template_id: unit_template_id, user_id: teacher_id)
    if units.empty?
      Unit.unscoped.where(name: UnitTemplate.find(unit_template_id).name, user_id: teacher_id)
    else
      units
    end
  end

  def self.assign_unit_to_one_class(classroom_id, unit_template_id, student_ids, assign_on_join)
    classroom = Classroom.find(classroom_id)
    teacher = classroom.owner
    units = Units::AssignmentHelpers.find_units_from_unit_template_and_teacher(unit_template_id, teacher.id)
    unit = nil

    if units.present?
      unit = Units::AssignmentHelpers.find_unit_from_units(units)
      unit.update(visible: true, open: true) if unit && !unit.visible
    end

    classroom_data = {
      id: classroom_id,
      student_ids: student_ids,
      assign_on_join: assign_on_join
    }

    if unit.present?
      self.show_classroom_units(unit.id, classroom_id)

      Units::Updater.assign_unit_template_to_one_class(
        unit.id,
        classroom_data,
        unit_template_id,
        teacher.id,
        concatenate_existing_student_ids: true
      )
    else
      Units::Creator.assign_unit_template_to_one_class(teacher.id, unit_template_id, classroom_data)
    end
  end

  def self.show_classroom_units(unit_id, classroom_id)
    ClassroomUnit.unscoped.where(unit_id: unit_id, classroom_id: classroom_id, visible: false).each do |classroom_unit|
      classroom_unit.update(visible: true, assigned_student_ids: [])
    end
  end

end
