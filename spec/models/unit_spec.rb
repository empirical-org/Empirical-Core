require 'rails_helper'

describe Unit, type: :model do
	let!(:classroom) {FactoryGirl.create(:classroom)}
	let!(:classroom_activity) {FactoryGirl.create(:classroom_activity_with_activity, classroom: classroom)}
	let!(:unit) {FactoryGirl.create :unit, classroom_activities: [classroom_activity]}

	describe '#destroy' do
		it 'destroys associated classroom_activities' do
			unit.destroy
			expect(ClassroomActivity.where(id: classroom_activity.id)).to be_empty
		end
	end
end