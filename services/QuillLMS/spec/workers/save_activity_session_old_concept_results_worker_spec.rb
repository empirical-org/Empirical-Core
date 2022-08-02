# frozen_string_literal: true

require 'rails_helper'

describe SaveActivitySessionOldConceptResultsWorker, type: :worker do

  context '#perform' do
    let!(:activity_session) { create(:activity_session_without_concept_results) }

    let(:writing_concept) { create(:concept, name: 'Creative Writing') }

    let(:concept_result1) do
      create(:old_concept_result,
        activity_session_id: activity_session.id,
        concept: writing_concept,
        metadata: { foo: 'bar', correct: true }
      )
    end

    let(:concept_result2) do
      create(:old_concept_result,
        activity_session_id: activity_session.id,
        metadata: { baz: 'foo', correct: true }
      )
    end

    let(:concept_result3) do
      create(:old_concept_result,
        activity_session_id: activity_session.id,
        metadata: { correct: true }
      )
    end

    let!(:concept_results) do
      results = JSON.parse([concept_result1, concept_result2, concept_result3].to_json)

      results[0] = results[0].except('id').merge('concept_uid' => concept_result1.concept.uid)
      results[1] = results[1].except('id').merge('concept_uid' => concept_result2.concept.uid)
      results[2] = results[2].except('id').merge('concept_uid' => concept_result3.concept.uid)

      results
    end

    it 'should save OldConceptResult records' do
      Sidekiq::Testing.inline! do
        expect { subject.perform(concept_results) }
          .to change { OldConceptResult.count }.by(3)
          .and change { ConceptResult.count }.by(3)
      end
    end

    it 'should pass on an array of IDs for the created OldConceptResults to the next worker' do
      expect(OldConceptResult).to receive(:create!).and_return(concept_result1, concept_result2, concept_result3)
      expect(SaveActivitySessionConceptResultsWorker).to receive(:perform_async).with([concept_result1.id, concept_result2.id, concept_result3.id])

      subject.perform(concept_results)
    end
  end
end
