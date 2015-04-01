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

  describe "getting units for the progress report" do
    let!(:teacher) { FactoryGirl.create(:teacher) }
    let(:section_ids) { [sections[0].id, sections[1].id] }
    let(:filters) { {} }
    include_context 'Section Progress Report'

    subject { Unit.for_standards_progress_report(teacher, filters).to_a }

    it 'can retrieve units based on no additional parameters' do
      expect(subject.size).to eq(units.size)
    end

    context 'sections' do
      let(:filters) { {section_id: section_ids} }

      it 'can retrieve units based on sections' do
        expect(subject.size).to eq(2) # 1 unit created for each section
      end
    end

    context 'students' do
      let(:filters) { {student_id: students.first.id} }

      it 'can retrieve units based on student_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'classrooms' do
      let(:filters) { {classroom_id: classrooms.first.id} }

      it 'can retrieve units based on classroom_id' do
        expect(subject.size).to eq(1)
      end
    end
  end
end