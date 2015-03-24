require 'rails_helper'

describe ConceptCategory, :type => :model do

  describe "progress report" do


    let!(:teacher) { FactoryGirl.create(:teacher) }
    let(:filters) { {} }

    include_context 'Concept Progress Report'

    subject { ConceptCategory.for_progress_report(teacher, filters).to_a }

    it "retrieves aggregated concept categories data" do
      data = subject
      expect(data.size).to eq(visible_categories.size)
      writing_data = data[0]
      expect(writing_data["concept_category_id"]).to eq(grammar_category.id)
      expect(writing_data["concept_category_name"]).to eq(grammar_category.name)
      expect(writing_data["total_result_count"]).to eq(grammar_results.size)
      expect(writing_data["correct_result_count"]).to eq(1)
      expect(writing_data["incorrect_result_count"]).to eq(1)
    end

    context 'classrooms' do
      let(:filters) { {classroom_id: other_classroom.id} }

      it 'can retrieve sections based on classroom_id' do
        expect(subject.size).to eq(0)
      end
    end

    context 'empty classroom' do
      let(:filters) { {classroom_id: ""} }

      it 'does not filter by classroom' do
        expect(subject.size).to eq(visible_categories.size)
      end
    end

    context 'units' do
      let(:filters) { {unit_id: other_unit.id} }

      it 'can retrieve sections based on unit_id' do
        expect(subject.size).to eq(0)
      end
    end

    context 'empty units' do
      let(:filters) { {unit_id: ""} }

      it 'does not filter by units' do
        expect(subject.size).to eq(visible_categories.size)
      end
    end

    context 'students' do
      let(:filters) { {student_id: other_student.id} }

      it 'can retrieve sections based on a student' do
        expect(subject.size).to eq(0)
      end
    end

    context 'empty students' do
      let(:filters) { {student_id: ""} }

      it 'does not filter by students' do
        expect(subject.size).to eq(visible_categories.size)
      end
    end
  end
end