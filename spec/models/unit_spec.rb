require 'rails_helper'


describe Unit, type: :model do 
	let!(:classroom) {FactoryGirl.create(:classroom)}
	let!(:student) {FactoryGirl.create(:student, classroom: classroom)}
	let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, classroom: classroom)}
	let!(:unit) {FactoryGirl.create :unit, classroom_activities: [classroom_activity]}


	describe '#destroy' do 

		it 'destroys associated classroom_activities' do 
			unit.destroy
			expect(ClassroomActivity.where(id: classroom_activity.id)).to be_empty
		end
	end


	it 'is touched by changes to classroom_activity' do 
		before = unit.updated_at
		classroom_activity.touch
		after = unit.updated_at
		expect(before).to_not eq(after)
	end

	it 'is touched by changes to activity_session (through intermediary classroom_activity)' do 
		before = unit.updated_at
		activity_session = FactoryGirl.create :activity_session, classroom_activity: classroom_activity
		activity_session.touch
		after = unit.updated_at
		expect(before).to_not eq(after)
	end

end