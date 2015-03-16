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
    let(:filters) { {} }

    before do
      setup_sections_progress_report
    end

    subject { Unit.for_standards_progress_report(teacher, filters).to_a }

    it 'can retrieve units based on no additional parameters' do
      expect(subject.size).to eq(@units.size)
    end

    context 'sections' do
      let(:filters) { {section_id: section_ids} }

      it 'can retrieve units based on sections' do
        expect(subject.size).to eq(2) # 1 unit created for each section
      end
    end

    context 'students' do
      let(:filters) { {student_id: @students.first.id} }

      it 'can retrieve units based on student_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'classrooms' do
      let(:filters) { {classroom_id: @classrooms.first.id} }

      it 'can retrieve units based on classroom_id' do
        expect(subject.size).to eq(1)
      end
    end
  end
end