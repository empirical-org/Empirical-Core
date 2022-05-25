# frozen_string_literal: true

require 'rails_helper'

describe CopyConceptResultsToResponsesWorker, type: :worker do

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
    let(:concept_result) { create(:sentence_combining, metadata: metadata, activity_session: activity_session) }

    it 'should create a Student Response record with Normalized Texts' do
      expect { subject.perform(concept_result.id, concept_result.id) }.to change(Response, :count).by(1)

      response = concept_result.response

      expect(response.activity_session).to eq(concept_result.activity_session)
      expect(response.concepts).to eq([concept_result.concept])
      expect(response.correct).to be(true)
      expect(response.attempt_number).to eq(metadata[:attemptNumber])
      expect(response.question).to eq(question)
      expect(response.question_number).to eq(metadata[:questionNumber])
      expect(response.question_score).to eq(metadata[:questionScore])
      expect(response.response_answer.json).to eq(metadata[:answer])
      expect(response.response_directions.text).to eq(metadata[:directions])
      expect(response.response_instructions).to be(nil)
      expect(response.response_previous_feedback.text).to eq(metadata[:lastFeedback])
      expect(response.response_prompt.text).to eq(metadata[:prompt])
      expect(response.response_question_type.text).to eq(concept_result.question_type)
    end

    it 'should be idempotent so that if the same ID is present twice, only one new record is created' do
      expect do
        subject.perform(concept_result.id, concept_result.id)
        subject.perform(concept_result.id, concept_result.id)
      end.to change(Response, :count).by(1)
         .and change(Response, :count).by(1)
    end

    it 'should run in batches up to BATCH_SIZE' do
      batch_size = 2
      stub_const("#{described_class}::BATCH_SIZE", batch_size)

      expect(ConceptResult).to receive(:find_in_batches).with(start: nil, finish: nil, batch_size: batch_size)

      subject.perform(nil, nil)
    end

    it 'should skip items with IDs lower than start' do
      concept_result
      activity_session2 = create(:activity_session_without_concept_results, activity: activity)
      used_concept_result = create(:sentence_combining, metadata: metadata, activity_session: activity_session2)

      expect(Response).not_to receive(:find_or_create_from_concept_result).with(concept_result)
      expect(Response).to receive(:find_or_create_from_concept_result).with(used_concept_result)

      subject.perform(used_concept_result.id, nil)
    end

    it 'should not process items with IDs higher than finish' do
      concept_result
      activity_session2 = create(:activity_session_without_concept_results, activity: activity)
      skipped_concept_result = create(:sentence_combining, metadata: metadata, activity_session: activity_session2)

      expect(Response).to receive(:find_or_create_from_concept_result).with(concept_result)
      expect(Response).not_to receive(:find_or_create_from_concept_result).with(skipped_concept_result)

      subject.perform(nil, concept_result.id)
    end
  end
end
