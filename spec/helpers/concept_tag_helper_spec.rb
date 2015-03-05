require "rails_helper"

describe ConceptTagHelper, type: :helper do
  describe "#typing_speed_stats" do
    let(:activity_session) { FactoryGirl.create(:activity_session) }
    let(:concept_class) { FactoryGirl.create(:concept_class, name: "Typing Speed")}
    let(:concept_tag) { FactoryGirl.create(:concept_tag, name: "Typing Speed", concept_class: concept_class)}
    let(:concept_category) { FactoryGirl.create(:concept_category, name: "Typing Speed")}

    before do
      10.times do |i|
        activity_session.concept_tag_results.create!(
          concept_tag: concept_tag,
          concept_category: concept_category,
          metadata: {
            wpm: i
          }
        )
      end
    end

    it "displays a breakdown of average words per minute" do
      average_wpm = 4 # It currently rounds down
      html = helper.typing_speed_stats(activity_session.concept_tag_results)
      expect(html).to include('Average words per minute')
      expect(html).to include(average_wpm.to_s)
      # expect(html).to have_tag('div', with: 'Average words per minute')
    end
  end

  describe "#grammar_concept_stats" do

  end
end