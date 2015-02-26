require 'rails_helper'

describe Unit, type: :model do
	let!(:classroom) {FactoryGirl.create(:classroom)}
	let!(:student) {FactoryGirl.create(:student, classroom: classroom)}
	let!(:classroom_activity) {FactoryGirl.create(:classroom_activity_with_activity, classroom: classroom)}
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

  describe "getting units for the progress report" do
    include ProgressReportHelper

    let!(:teacher) { FactoryGirl.create(:teacher) }
    let(:section_ids) { [@sections[0].id, @sections[1].id] }

    before do
      setup_sections_progress_report
    end

    it 'can retrieve units based on sections' do
      units = Unit.for_progress_report(teacher, {section_id: section_ids})
      expect(units.size).to eq(2) # 1 unit created for each section
    end

    it 'can retrieve units based on student_id' do
      units = Unit.for_progress_report(teacher, {student_id: @students.first.id})
      expect(units.size).to eq(1)
    end

    it 'can retrieve units based on classroom_id' do
      units = Unit.for_progress_report(teacher, {classroom_id: @classrooms.first.id})
      expect(units.size).to eq(1)
    end

    it 'can retrieve units based on no additional parameters' do
      units = Classroom.for_progress_report(teacher, {})
      expect(units.size).to eq(@units.size)
    end
  end
end