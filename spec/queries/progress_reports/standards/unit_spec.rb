require 'rails_helper'

describe ProgressReports::Standards::Unit do
  let!(:classroom) {create(:classroom)}
  let!(:student) {create(:student, classrooms: [classroom])}
  let!(:classroom_activity) {create(:classroom_activity_with_activity, classroom: classroom)}
  let!(:unit) {create :unit, classroom_activities: [classroom_activity]}

  describe "getting units for the progress report" do
    let!(:teacher) { create(:teacher) }
    let(:section_ids) { [sections[0].id, sections[1].id] }
    let(:filters) { {} }
    include_context 'Section Progress Report'

    subject { ProgressReports::Standards::Unit.new(teacher).results(filters).to_a }

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