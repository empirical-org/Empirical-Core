# frozen_string_literal: true

require 'rails_helper'
include AsyncHelper

describe FastAssignWorker, type: :worker do
  include_context "Unit Assignments Variables"

  context 'creates a new unit' do
    it "can create new units and classroom activities" do
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      expect(unit_templates_have_a_corresponding_unit?([unit_template1.id])).to eq(true)
      eventually { expect(units_have_corresponding_unit_activities?([unit_template1.id])).to eq(true) }
    end
  end

  context 'updates an existing unit' do
    let!(:unit) { create(:unit, name: unit_template1.name, user_id: teacher.id) }

    it "does not duplicate the existing unit" do
      units_with_a_specific_name = Unit.where(name: unit_template1.name).count
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      expect(Unit.where(name: unit_template1.name).count).to eq(units_with_a_specific_name)
    end

    it "and adds new classroom activities to the existing unit" do
      original_units_cus = ClassroomUnit.where(unit_id: unit.id).count
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      new_units_cus = ClassroomUnit.where(unit_id: unit.id).count
      eventually { expect(new_units_cus - original_units_cus).to eq(1)}
    end

    it "that assigns the new activities to all students" do
      original_classroom_unit = ClassroomUnit.create!(unit_id: unit.id, classroom_id: classroom.id, assigned_student_ids: [student.id])
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      expect(unit.classroom_units.find(original_classroom_unit.id).assign_on_join).to eq(true)
    end
  end
end
