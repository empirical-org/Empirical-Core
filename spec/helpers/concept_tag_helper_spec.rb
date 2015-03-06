require "rails_helper"

describe ConceptTagHelper, type: :helper do
  let!(:activity_session) { FactoryGirl.create(:activity_session) }
  let(:typing_speed_class) { FactoryGirl.create(:concept_class, name: "Typing Speed") }
  let(:typing_speed_category) { FactoryGirl.create(:concept_category, name: "Typing Speed") }
  let(:typing_speed_tag) { FactoryGirl.create(:concept_tag, name: "Typing Speed", concept_class: typing_speed_class) }
  let(:grammar_concepts_class) { FactoryGirl.create(:concept_class, name: "Grammar Concepts")}
  let(:grammar_category) { FactoryGirl.create(:concept_category, name: "Something grammar")}
  let(:prepositions_tag) { FactoryGirl.create(:concept_tag, name: "Prepositions", concept_class: grammar_concepts_class)}

  describe "#all_concept_class_stats" do
    before do
      activity_session.concept_tag_results.create!(
        concept_tag: typing_speed_tag,
        concept_category: typing_speed_category,
        metadata: {
          wpm: 5
        }
      )
      activity_session.concept_tag_results.create!(
        concept_tag: prepositions_tag,
        concept_category: grammar_category,
        metadata: {
          correct: 1
        }
      )
    end

    it "displays all concept class stats for an activity session" do
      html = helper.all_concept_class_stats(activity_session)
      typing_speed_header = "Typing Speed"
      grammar_header = "Grammar Concepts"
      expect(html).to include(typing_speed_header)
      expect(html).to include(grammar_header)
      expect(html).to include(prepositions_tag.name)
    end
  end

  describe "#grammar_concepts_stats" do
    before do
      activity_session.concept_tag_results.create!(
        concept_tag: typing_speed_tag,
        concept_category: typing_speed_category,
        metadata: {
          wpm: 5
        }
      )
      activity_session.concept_tag_results.create!(
        concept_tag: prepositions_tag,
        concept_category: grammar_category,
        metadata: {
          correct: 1
        }
      )
    end

    it "displays a breakdown of the grammar concepts and correct/incorrect" do
      html = helper.grammar_concepts_stats(activity_session.concept_tag_results)
      # These expectations are kinda weird because it's a pain to match the html structure
      expect(html).to include(prepositions_tag.name)
      expect(html).to include("1")
      expect(html).to include("0")
    end

    it "should only include tags from the Grammar Concepts class" do
      html = helper.grammar_concepts_stats(activity_session.concept_tag_results)
      expect(html).to_not include(typing_speed_tag.name)
    end

    context "when there are badly-formed results" do
      let(:bad_tag) { FactoryGirl.create(:concept_tag, concept_class: grammar_concepts_class) }

      before do
        activity_session.concept_tag_results.create!(
          concept_tag: bad_tag,
          concept_category: grammar_category,
          metadata: {} # Missing a 'correct field'
        )
      end

      it "should not include those results in the counts" do
        html = helper.grammar_concepts_stats(activity_session.concept_tag_results)
        expect(html).to_not include(bad_tag.name)
      end
    end

  end

  describe "#typing_speed_stats" do
    before do
      10.times do |i|
        activity_session.concept_tag_results.create!(
          concept_tag: typing_speed_tag,
          concept_category: typing_speed_category,
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
end