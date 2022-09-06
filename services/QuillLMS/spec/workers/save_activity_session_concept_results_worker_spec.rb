# frozen_string_literal: true

require 'rails_helper'

describe SaveActivitySessionConceptResultsWorker, type: :worker do

  context '#perform' do
    let(:activity_session) { create(:activity_session_without_concept_results) }
    let(:concept) { create(:concept) }
    let(:json_payload) { {
      activity_session_id: activity_session.id,
      concept_id: concept.id,
      question_type: "sentence-writing",
      metadata: {
        answer: "This is a response answer",
        attemptNumber: 1,
        correct: 1,
        directions: "This a student response directions 2.",
        instructions: "This a student response directions 2.",
        lastFeedback: "This a student response answer 2.",
        prompt: "This a student response prompt 2.",
        questionNumber: 1
      }
    } }

    it 'should save new ConceptResult records' do
      expect { subject.perform(json_payload) }
        .to change(ConceptResult, :count).by(1)
      expect(activity_session.reload.concept_results).to be
    end

    it 'should save new OldConceptResult records linked to the new ConceptResult' do
      expect { subject.perform(json_payload) }
        .to change(OldConceptResult, :count).by(1)
      expect(activity_session.reload.concept_results.first.old_concept_result).to be
    end
  end
end
