require 'rails_helper'
require 'sidekiq/testing'
Sidekiq::Testing.fake!



describe Units::Creator do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  let!(:classroom) { FactoryGirl.create(:classroom_with_one_student, teacher: teacher) }
  let!(:activity) { FactoryGirl.create(:activity)}
  let!(:unit_template) { FactoryGirl.create(:unit_template, activities: [activity]) }

  describe 'unit_creator' do

    describe 'calling run' do
      it 'creates a unit with teacher and kicks off an assign activity worker' do
        current_jobs = AssignActivityWorker.jobs.size
        Units::Creator.run(teacher, 'Something Really Cool', [{id: 1}], [{id: classroom.id, student_ids: []}])
        expect(Unit.last.user).to eq(teacher)
        expect(AssignActivityWorker.jobs.size).to eq(current_jobs + 1)
      end
    end

    describe 'calling fast assign' do
      it 'creates a unit with a unit template' do
        Units::Creator.fast_assign_unit_template(teacher.id, unit_template)
        expect(Unit.last.unit_template).to eq(unit_template)
      end

      it 'gives the unit the name of the unit template' do
        Units::Creator.fast_assign_unit_template(teacher.id, unit_template)
        expect(Unit.last.name).to eq(unit_template.name)
      end

      it 'gives the unit the same activities as the unit template' do
        Units::Creator.fast_assign_unit_template(teacher.id, unit_template)
        expect(Unit.last.activities).to eq(unit_template.activities)
      end
    end

    describe 'calling assign_unit_template_to_one_class' do
      it 'creates a unit with a unit template' do
        Units::Creator.assign_unit_template_to_one_class(teacher.id, unit_template, [classroom])
        expect(Unit.last.unit_template).to eq(unit_template)
      end

      it 'gives the unit the name of the unit template' do
        Units::Creator.assign_unit_template_to_one_class(teacher.id, unit_template, [classroom])
        expect(Unit.last.name).to eq(unit_template.name)
      end

      it 'gives the unit the same activities as the unit template' do
        Units::Creator.assign_unit_template_to_one_class(teacher.id, unit_template, [classroom])
        expect(Unit.last.activities).to eq(unit_template.activities)
      end
    end

  end
end
