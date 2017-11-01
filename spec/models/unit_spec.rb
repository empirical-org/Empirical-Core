require 'rails_helper'

describe Unit, type: :model do
  let!(:classroom) {FactoryBot.create(:classroom)}
  let!(:teacher) {FactoryBot.create(:teacher)}
  let!(:activity) {FactoryBot.create(:activity)}
  let!(:unit) {FactoryBot.create :unit, user: teacher}
  let!(:classroom_activity) {FactoryBot.create(:classroom_activity_with_activity, classroom: classroom, unit: unit)}

  describe 'user_id field' do
    it 'should not raise an error' do
      expect{ unit.user_id }.not_to raise_error
    end
  end

  describe 'the name field' do

    context "it should be unique" do
      it "at the teacher level" do
        non_uniq_unit = Unit.create(name: unit.name, user: teacher)
        expect(non_uniq_unit.valid?).to eq(false)
      end

      context 'it should be scoped to visibility' do

        let!(:non_uniq_unit) {Unit.new(name: unit.name, user: teacher, visible: true)}

        it "when visibile == true it must be unique" do
          expect{non_uniq_unit.save!}.to raise_error
        end

        it "unless visibility == false" do
          non_uniq_unit.visible = false
          expect{non_uniq_unit.save!}.to_not raise_error
        end

        it "unless the original unit's visibility == false" do
          unit.update(visible: false)
          expect{non_uniq_unit.save!}.to_not raise_error
        end

      end

      it "does not have to be unique by name with different teachers" do
        different_teacher = User.create(role: 'teacher')
        new_unit = Unit.create(name: unit.name, user: different_teacher)
        expect(new_unit.valid?).to eq(true)
      end
    end

  end

  describe 'default_scope' do
    it 'marks units visible by default' do
      result = Unit.new
      expect(result.visible).to eq(true)
    end

    it 'does not include units that are marked invisible' do
      result = Unit.new(name: "hidden unit", visible: false)
      expect(Unit.where(name: result.name)).to be_empty
    end
  end

  describe '#hide_if_no_visible_classroom_activities' do
    it 'updates the unit to visible == false if all of its classroom activities are visible == false' do
      unit.classroom_activities.each{|ca| ca.update(visible: false)}
      unit.reload
      unit.hide_if_no_visible_classroom_activities
      expect(unit.visible).to eq(false)
    end

    it 'does not update the unit to visible == false if it has any visible classroom activities' do
      unit.hide_if_no_visible_classroom_activities
      expect(unit.visible).to eq(true)
    end
  end

  describe '#destroy' do
    it 'destroys associated classroom_activities' do
      unit.destroy
      expect(ClassroomActivity.where(id: classroom_activity.id)).to be_empty
    end
  end

  describe '#hide_classroom_activities_if_visible_false' do
    it 'is called when the unit is saved' do
      expect(unit).to receive(:hide_classroom_activities_if_visible_false)
      unit.update(name: 'new name')
    end

    it "does not update the unit's classroom activities unless the unit is archived" do
      old_ca_attributes = classroom_activity.attributes
      unit.update(name: 'something else')
      expect(classroom_activity.attributes).to eq(old_ca_attributes)
    end

    it "archives the unit's classroom activities if the unit archived" do
      old_ca_attributes = classroom_activity.attributes
      unit.update(name: 'something else')
      expect(classroom_activity.attributes).to eq(old_ca_attributes)
    end



  end





end
