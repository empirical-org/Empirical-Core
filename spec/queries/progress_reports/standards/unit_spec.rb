require 'rails_helper'

describe ProgressReports::Standards::Unit do

  describe "getting units for the progress report" do
    include_context 'Section Progress Report'
    let(:section_ids) { [sections[0].id, sections[1].id] }
    let(:filters) { {} }
    let(:teacher) {classrooms.first.owner}
    before do
      ClassroomsTeacher.all.each{|ct| ct.update(user: teacher)}
    end

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
