# frozen_string_literal: true

class ClassroomUnitsSaver < ApplicationService
  attr_reader :classrooms_data, :concatenate_existing_student_ids, :new_classroom_units_data, :unit_id

  def initialize(classrooms_data, concatenate_existing_student_ids, unit_id)
    @concatenate_existing_student_ids = concatenate_existing_student_ids
    @new_classroom_units_data = []
    @unit_id = unit_id

    @classrooms_data =
      classrooms_data
        .map(&:symbolize_keys)
        .select { |classroom_data| classroom_data.key?(:id) }
        .reject { |classroom_data| classroom_data[:id].nil? }
        .uniq { |classroom_data| classroom_data[:id].to_i }
  end

  def run
    update_existing_classroom_units_and_aggregate_new_classroom_units_data
    bulk_create_classroom_units
  end

  private def bulk_create_classroom_units
    ClassroomUnit.create!(new_classroom_units_data)
  end

  private def classroom_units
    @classroom_units ||= ClassroomUnit.where(unit_id: unit_id)
  end

  private def update_existing_classroom_units_and_aggregate_new_classroom_units_data
    classrooms_data.each do |classroom_data|
      classroom_id = classroom_data[:id].to_i
      classroom_unit = classroom_units.find { |cu| cu.classroom_id == classroom_id }

      if classroom_unit
        ClassroomUnitUpdater.run(classroom_data, classroom_unit, concatenate_existing_student_ids)
      else
        new_classroom_units_data.push(
          assign_on_join: classroom_data[:assign_on_join],
          assigned_student_ids: classroom_data[:student_ids],
          classroom_id: classroom_id,
          unit_id: unit_id
        )
      end
    end
  end
end
