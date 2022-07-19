# frozen_string_literal: true

require 'rails_helper'

describe CopySingleConceptResultWorker, type: :worker do

  context '#perform' do
    let(:question) { create(:question) }
    let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
    let(:activity_session) { create(:activity_session_without_concept_results, activity: activity) }
    let(:metadata) do
      {
        "correct": 1,
        "directions": "Combine the sentences. (And)",
        "lastFeedback": "Proofread your work. Check your spelling.",
        "prompt": "Deserts are very dry. Years go by without rain.",
        "attemptNumber": 2,
        "answer": "Deserts are very dry, and years go by without rain.",
        "questionNumber": 1,
        "questionScore": 0.8
      }
    end
    let(:old_concept_result) { create(:sentence_combining, metadata: metadata, activity_session: activity_session) }

    it 'should create a Student ConceptResult record with Normalized Texts' do
      expect { subject.perform(old_concept_result.id) }.to change(ConceptResult, :count).by(1)

      concept_result = old_concept_result.concept_result

      expect(concept_result.activity_session).to eq(old_concept_result.activity_session)
      expect(concept_result.concept).to eq(old_concept_result.concept)
      expect(concept_result.correct).to be(true)
      expect(concept_result.attempt_number).to eq(metadata[:attemptNumber])
      expect(concept_result.question_number).to eq(metadata[:questionNumber])
      expect(concept_result.question_score).to eq(metadata[:questionScore])
      expect(concept_result.answer).to eq(metadata[:answer])
      expect(concept_result.concept_result_directions.text).to eq(metadata[:directions])
      expect(concept_result.concept_result_instructions).to be(nil)
      expect(concept_result.concept_result_previous_feedback.text).to eq(metadata[:lastFeedback])
      expect(concept_result.concept_result_prompt.text).to eq(metadata[:prompt])
      expect(concept_result.concept_result_question_type.text).to eq(old_concept_result.question_type)
    end
  end
end
