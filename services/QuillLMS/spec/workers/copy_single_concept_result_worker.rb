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
        "instructions": "Instructions go here.",
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
      expect(concept_result.concept_result_instructions.text).to eq(metadata[:instructions])
      expect(concept_result.concept_result_previous_feedback.text).to eq(metadata[:lastFeedback])
      expect(concept_result.concept_result_prompt.text).to eq(metadata[:prompt])
      expect(concept_result.concept_result_question_type.text).to eq(old_concept_result.question_type)
    end

    it 'should return early if the old_concept_result_id has already been migrated' do
      create(:concept_result, old_concept_result_id: old_concept_result.id)
      expect do
        subject.perform(old_concept_result.id)
      end.to change(ConceptResult, :count).by(0)
    end

    it 'should return early if the specified OldConceptResult id does not reference a real object' do
      expect(subject.perform(old_concept_result.id + 1000)).to be(nil)
    end

    it 'should successfully migrate even if the "answer" has a Postgres-invalid character like \u0000' do
      old_concept_result.metadata['answer'] = "\u0000Test"
      old_concept_result.save

      subject.perform(old_concept_result.id)

      expect(old_concept_result.reload.concept_result.answer).to eq('Test')
    end

    it 'should handle cases where, for some reason, the data in "metadata" is a JSON string instead of a JSON object, and needs to be parsed' do
      old_concept_result.metadata = metadata.to_json
      old_concept_result.save

      subject.perform(old_concept_result.id)
      expect(old_concept_result.reload.concept_result.answer).to eq(metadata[:answer])
    end
  end
end
