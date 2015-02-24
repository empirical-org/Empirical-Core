require 'rails_helper'

describe Unit, :type => :model do

    describe "getting units for the progress report" do
      include ProgressReportHelper

      let!(:teacher) { FactoryGirl.create(:teacher) }
      let(:section_ids) { [@sections[0].id, @sections[1].id] }

      before do
        setup_sections_progress_report
      end

      it 'can retrieve units based on sections' do
        units = Unit.for_progress_report(section_ids, teacher, {})
        expect(units.size).to eq(2) # 1 classroom created for each section
      end

      it 'can retrieve units based on student_id' do
        units = Unit.for_progress_report(section_ids, teacher, {student_id: @students.first.id})
        expect(units.size).to eq(1)
      end

      it 'can retrieve units based on classroom_id' do
        units = Unit.for_progress_report(section_ids, teacher, {classroom_id: @classrooms.first.id})
        expect(units.size).to eq(1)
      end

    end
end