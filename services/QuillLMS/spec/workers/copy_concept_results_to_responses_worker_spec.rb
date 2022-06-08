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
      expect(response.concept).to eq(concept_result.concept)
      expect(response.correct).to be(true)
      expect(response.attempt_number).to eq(metadata[:attemptNumber])
      expect(response.question_number).to eq(metadata[:questionNumber])
      expect(response.question_score).to eq(metadata[:questionScore])
      expect(response.answer).to eq(metadata[:answer])
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

    it 'should skip items with IDs lower than start' do
      concept_result
      activity_session2 = create(:activity_session_without_concept_results, activity: activity)
      used_concept_result = create(:sentence_combining, metadata: metadata, activity_session: activity_session2)

      bulk_insert_worker_stub = double
      expect(Response).to receive(:bulk_insert).and_yield(bulk_insert_worker_stub)

      expect(bulk_insert_worker_stub).to receive(:add).with(hash_including(concept_result_id: used_concept_result.id))
      expect(bulk_insert_worker_stub).not_to receive(:add).with(hash_including(concept_result_id: concept_result.id))

      subject.perform(used_concept_result.id, used_concept_result.id)
    end

    it 'should not process items with IDs higher than finish' do
      concept_result
      activity_session2 = create(:activity_session_without_concept_results, activity: activity)
      unused_concept_result = create(:sentence_combining, metadata: metadata, activity_session: activity_session2)

      bulk_insert_worker_stub = double
      expect(Response).to receive(:bulk_insert).and_yield(bulk_insert_worker_stub)

      expect(bulk_insert_worker_stub).to receive(:add).with(hash_including(concept_result_id: concept_result.id))
      expect(bulk_insert_worker_stub).not_to receive(:add).with(hash_including(concept_result_id: unused_concept_result.id))

      subject.perform(concept_result.id, concept_result.id)
    end
  end
end
