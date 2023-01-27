# frozen_string_literal: true

class ClassroomUnitUpdater < ApplicationService
  attr_reader :assign_on_join, :student_ids, :classroom_unit, :concatenate_existing_student_ids

  def initialize(classroom_data, classroom_unit, concatenate_existing_student_ids)
    @assign_on_join = classroom_data[:assign_on_join]
    @student_ids = classroom_data[:student_ids]
    @classroom_unit = classroom_unit
    @concatenate_existing_student_ids = concatenate_existing_student_ids
  end

  def run
    if student_ids == false
      classroom_unit.archive!
    elsif classroom_unit.assigned_student_ids != student_ids
      classroom_unit.update!(
        assign_on_join: assign_on_join,
        assigned_student_ids: assigned_student_ids,
        visible: true
      )
    elsif classroom_unit.assign_on_join != assign_on_join
      classroom_unit.update!(
        assign_on_join: assign_on_join,
        visible: true
      )
    elsif classroom_unit.archived?
      classroom_unit.unarchive!
    end
  end

  private def assigned_student_ids
    return student_ids unless concatenate_existing_student_ids

    classroom_unit
      .assigned_student_ids
      .union(student_ids.map(&:to_i))
      .sort
  end
end
