require 'rails_helper'

describe Unit, type: :model do
  let!(:classroom) {FactoryGirl.create(:classroom)}
  let!(:teacher) {FactoryGirl.create(:teacher)}
  let!(:classroom_activity) {FactoryGirl.create(:classroom_activity_with_activity, classroom: classroom)}
  let!(:unit) {FactoryGirl.create :unit, classroom_activities: [classroom_activity], user: teacher}

  describe 'user_id field' do
    it 'should not raise an error' do
      expect{ unit.user_id }.not_to raise_error
    end

    # it 'should return a user id' do
    #   pending("factory girl seems to be converting the user_id into a string I do not know why.")
    # end
  end

  describe 'the name field' do

    context "it should be unique" do
      it "at the teacher level" do
        non_uniq_unit = Unit.create(name: unit.name, user: teacher)
        expect(non_uniq_unit.valid?).to eq(false)
      end

      it "by visibility" do
        non_uniq_unit = Unit.create(name: unit.name, user: teacher, visible: false)
        expect(non_uniq_unit.valid?).to eq(true)
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

  describe '#destroy' do
    it 'destroys associated classroom_activities' do
      unit.destroy
      expect(ClassroomActivity.where(id: classroom_activity.id)).to be_empty
    end
  end



end
