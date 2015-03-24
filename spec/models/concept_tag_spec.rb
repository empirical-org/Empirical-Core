require 'rails_helper'

describe ConceptTag, :type => :model do

  describe "progress report" do

    include_context 'Concept Progress Report'
    let!(:teacher) { FactoryGirl.create(:teacher) }


    it "retrieves aggregated concept categories data" do
      data = ConceptTag.for_progress_report(teacher, {concept_category_id: writing_category.id}).to_a
      expect(data.size).to eq(writing_category_tags.size)
      writing_data = data[0]
      expect(writing_data["concept_tag_id"].to_i).to eq(writing_tag.id)
      expect(writing_data["concept_tag_name"]).to eq(writing_tag.name)
      expect(writing_data["total_result_count"].to_i).to eq(writing_results.size)
      expect(writing_data["correct_result_count"].to_i).to eq(2)
      expect(writing_data["incorrect_result_count"].to_i).to eq(1)
    end
  end
end