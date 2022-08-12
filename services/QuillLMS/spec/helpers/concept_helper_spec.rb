# frozen_string_literal: true

require "rails_helper"

describe ConceptHelper, type: :helper do
  let!(:activity_session) { create(:activity_session) }
  let(:punctuation_concept) { create(:concept, name: "Punctuation") }
  let(:prepositions_concept) { create(:concept, name: "Prepositions")}

  describe "#all_concept_stats" do
    before do
      activity_session.concept_results.create!(
        concept: punctuation_concept,
        correct: false
      )
      activity_session.concept_results.create!(
        concept: prepositions_concept,
        correct: true
      )
    end

    it "displays all concept stats for an activity session" do
      html = helper.all_concept_stats(activity_session)
      expect(html).to include(punctuation_concept.name)
      expect(html).to include(prepositions_concept.name)
    end
  end
end
