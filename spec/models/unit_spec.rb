require 'rails_helper'

describe Unit, type: :model do
	let!(:classroom) {FactoryGirl.create(:classroom)}
	let!(:classroom_activity) {FactoryGirl.create(:classroom_activity_with_activity, classroom: classroom)}
	let!(:unit) {FactoryGirl.create :unit, classroom_activities: [classroom_activity]}


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
