require 'rails_helper'

describe ConceptCategory, :type => :model do

  describe "progress report" do
    include ProgressReportHelper

    let!(:teacher) { FactoryGirl.create(:teacher) }

    before do
      setup_concepts_progress_report
    end

    it "retrieves aggregated concept categories data" do
      data = ConceptCategory.for_progress_report(teacher, {})
      expect(data.size).to eq(@visible_categories.size)
      writing_data = data[0]
      expect(writing_data["concept_category_id"].to_i).to eq(@grammar_category.id)
      expect(writing_data["concept_category_name"]).to eq(@grammar_category.name)
      expect(writing_data["total_result_count"].to_i).to eq(@grammar_results.size)
      expect(writing_data["correct_result_count"].to_i).to eq(1)
      expect(writing_data["incorrect_result_count"].to_i).to eq(1)
    end

    # context "when a classroom filter is provided" do
    #   it "filters by classroom" do
    #     data = ConceptCategory.for_progress_report(teacher, {classroom_id: @empty_classroom.id})
    #     expect(data.size).to eq(0)
    #     data = ConceptCategory.for_progress_report(teacher, {classroom_id: @full_classroom.id})
    #     expect(data.size).to eq(@visible_topics.size)
    #   end
    # end

    # context "when an empty classroom filter is provided" do
    #   it "does not filter by classroom" do
    #     data = ConceptCategory.for_progress_report(teacher, {classroom_id: ""})
    #     expect(data.size).to eq(@visible_topics.size)
    #   end
    # end

    # context "when a unit filter is provided" do
    #   it "filters by unit" do
    #     data = ConceptCategory.for_progress_report(teacher, {unit_id: @unit1.id})
    #     expect(data.size).to eq(@visible_topics.size)
    #     data = ConceptCategory.for_progress_report(teacher, {unit_id: @empty_unit.id})
    #     expect(data.size).to eq(0)
    #   end
    # end

    # context "when an empty unit filter is provided" do
    #   it "does not filter by unit" do
    #     data = ConceptCategory.for_progress_report(teacher, {unit_id: ""})
    #     expect(data.size).to eq(@visible_topics.size)
    #   end
    # end

    # context "when a student filter is provided" do
    #   it "filters by student" do
    #     # student3 has completed activity sessions for only 1 topic
    #     data = ConceptCategory.for_progress_report(teacher, {student_id: @student3.id})
    #     expect(data.size).to eq(1)
    #     expect(data[0]['concept_category_name']).to eq(@second_grade_topic.name)
    #   end
    # end

    # context "when an empty student filter is provided" do
    #   it "does not filter by student" do
    #     data = ConceptCategory.for_progress_report(teacher, {student_id: ""})
    #     expect(data.size).to eq(@visible_topics.size)
    #   end
    # end
  end
end