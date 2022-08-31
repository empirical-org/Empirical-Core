# frozen_string_literal: true

require 'rails_helper'

describe CopyOldConceptResultsToConceptResultsWorker, type: :worker do

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

    context 'batch_insert is true' do
      it 'should create a Student ConceptResult record with Normalized Texts' do
        expect { subject.perform(old_concept_result.id, old_concept_result.id, true) }.to change(ConceptResult, :count).by(1)

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

      it 'should normalize empty string values as nil references to normalized tables' do
        new_metadata = metadata.merge({'instructions': ''})
        old_concept_result.update(metadata: new_metadata)

        expect { subject.perform(old_concept_result.id, old_concept_result.id, true) }.to change(ConceptResult, :count).by(1)

        concept_result = old_concept_result.concept_result

        expect(concept_result.concept_result_instructions).to eq(nil)
      end

      it 'should be idempotent so that if the same ID is present twice, only one new record is created' do
        expect do
          subject.perform(old_concept_result.id, old_concept_result.id, true)
          subject.perform(old_concept_result.id, old_concept_result.id, true)
        end.to change(ConceptResult, :count).by(1)
      end

      it 'should skip items with IDs lower than start' do
        old_concept_result
        activity_session2 = create(:activity_session_without_concept_results, activity: activity)
        used_old_concept_result = create(:sentence_combining, metadata: metadata, activity_session: activity_session2)

        bulk_insert_worker_stub = double
        expect(ConceptResult).to receive(:bulk_insert).and_yield(bulk_insert_worker_stub)

        expect(bulk_insert_worker_stub).to receive(:add).with(hash_including(old_concept_result_id: used_old_concept_result.id))
        expect(bulk_insert_worker_stub).not_to receive(:add).with(hash_including(old_concept_result_id: old_concept_result.id))

        subject.perform(used_old_concept_result.id, used_old_concept_result.id, true)
      end

      it 'should not process items with IDs higher than finish' do
        old_concept_result
        activity_session2 = create(:activity_session_without_concept_results, activity: activity)
        unused_old_concept_result = create(:sentence_combining, metadata: metadata, activity_session: activity_session2)

        bulk_insert_worker_stub = double
        expect(ConceptResult).to receive(:bulk_insert).and_yield(bulk_insert_worker_stub)

        expect(bulk_insert_worker_stub).to receive(:add).with(hash_including(old_concept_result_id: old_concept_result.id))
        expect(bulk_insert_worker_stub).not_to receive(:add).with(hash_including(old_concept_result_id: unused_old_concept_result.id))

        subject.perform(old_concept_result.id, old_concept_result.id, true)
      end

      it 'should raise custom ConceptResultMigrationDeadlocked error when it triggers and ActiveRecord::Deadlocked error' do
        expect(ConceptResult).to receive(:bulk_insert).and_raise(ActiveRecord::Deadlocked)

        expect { subject.perform(1,1, true) }.to raise_error(CopyOldConceptResultsToConceptResultsWorker::ConceptResultMigrationDeadlocked)
      end
    end

    context 'batch_insert is false' do
      it 'should enqueue CopySingleConceptResultWorker job for each id passed in' do
        min_id = 1
        max_id = 5
        (min_id..max_id).each do |id|
          expect(CopySingleConceptResultWorker).to receive(:perform_async).once.with(id)
        end

        subject.perform(min_id, max_id, false)
      end
    end
  end
end
