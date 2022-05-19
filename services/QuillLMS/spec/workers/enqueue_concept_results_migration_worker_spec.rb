# frozen_string_literal: true

require 'rails_helper'

describe EnqueueConceptResultsMigrationWorker, type: :worker do

  context '#perform' do
    # Weird gotcha here: if you create a new raw concept_result the factory
    # calls the base activity_session factory.  That factory creates a NEW
    # concept_result related to it, so `create(:concept_result)` secretly
    # creates two different ConceptResult records.  By pre-specifying an
    # ActivitySession with no concept_results, we can guarantee that the
    # ConceptResult factory calls only generate one record
    let!(:activity_session) { create(:activity_session_without_concept_results) }
    let!(:concept_result) { create(:concept_result, activity_session: activity_session) }

    it 'should find all ConceptResult records in batches' do
      start = nil
      finish = nil
      batch_size = 1
      stub_const("#{described_class}::BATCH_SIZE", batch_size)
      select_double = double

      expect(ConceptResult).to receive(:select).and_return(select_double)
      expect(select_double).to receive(:find_in_batches).with(start: start, finish: finish, batch_size: batch_size).and_return([concept_result.id])

       subject.perform(start, finish)
    end

    it 'should enqueue a CopyConceptResultsToStudentResponsesWorker' do
      concept_result_ids = ConceptResult.select(:id).all.map(&:id)

      expect(CopyConceptResultsToStudentResponsesWorker).to receive(:perform_async).with(concept_result_ids)

      subject.perform(nil, nil)
    end

    it 'should take start params to skip existing ConceptResults' do
      new_concept_result = create(:concept_result, activity_session: activity_session)

      expect(CopyConceptResultsToStudentResponsesWorker).to receive(:perform_async).with([new_concept_result.id])

      subject.perform(new_concept_result.id, nil)
    end

    it 'should take finish params to stop after specific ConceptResults' do
      new_concept_result = create(:concept_result, activity_session: activity_session)

      expect(CopyConceptResultsToStudentResponsesWorker).to receive(:perform_async).with([concept_result.id])

      subject.perform(nil, concept_result.id)
    end
  end
end
