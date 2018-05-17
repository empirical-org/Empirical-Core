require 'rails_helper'
include AsyncHelper

describe FastAssignWorker, type: :worker do
  include_context "Unit Assignments Variables"
  let!(:unit) {create(:unit, name: unit_template1.name, user_id: teacher.id)}

  context 'creates a new unit' do
    it "can create new units and classroom activities" do
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      expect(unit_templates_have_a_corresponding_unit?([unit_template1.id])).to eq(true)
      eventually { expect(units_have_a_corresponding_classroom_activities?([unit_template1.id])).to eq(true) }
    end
  end

  context 'updates an existing unit' do
    it "does not duplicate the existing unit" do
      units_with_a_specific_name = Unit.where(name: unit_template1.name).count
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      expect(Unit.where(name: unit_template1.name).count).to eq(units_with_a_specific_name)
    end

    it "and adds new classroom activities to the existing unit" do
      # TODO: something is wrong with the associations
      original_units_cas = ClassroomActivity.where(unit_id: unit.id).count
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      new_units_cas = ClassroomActivity.where(unit_id: unit.id).count
      eventually { expect(new_units_cas - original_units_cas).to eq(1)}
    end

    it "that assigns the new activities to all students" do
      original_classroom_activity = ClassroomActivity.create!(unit_id: unit.id, activity_id: unit_template1.activities.first.id, classroom_id: classroom.id, assigned_student_ids: [student.id])
      FastAssignWorker.new.perform(teacher.id, unit_template1.id)
      expect(unit.classroom_activities.find(original_classroom_activity.id).assign_on_join).to eq(true)
    end
  end


end
