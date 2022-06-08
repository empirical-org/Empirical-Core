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

    it 'should have a max id to process equal to the highest ConceptResult.id' do
      max_id = 99999
      expect(ConceptResult).to receive(:maximum).with(:id).and_return(max_id)
      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(1, max_id)

      subject.perform(nil, nil)
    end

    it 'should call CopyConceptResultsToResponsesWorker in batches of batch_size' do
      batch_size = 2
      stub_const("#{described_class}::BATCH_SIZE", batch_size)
      max_id = 10
      expect(ConceptResult).to receive(:maximum).with(:id).and_return(max_id)

      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(1, 2).once
      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(3, 4).once
      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(5, 6).once
      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(7, 8).once
      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(9, 10).once

      subject.perform(nil, nil)
    end

    it 'should begin enqueing starting with start value' do
      max_id = 10
      expect(ConceptResult).to receive(:maximum).with(:id).and_return(max_id)
      start_id = 4

      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(start_id, max_id).once

      subject.perform(start_id, nil)
    end

    it 'should stop enqueing with finish value as long as finish is lower than max(ConceptResult.id)' do
      end_id = 10

      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(1, end_id).once

      subject.perform(nil, end_id)
    end

    it 'should stop enqueing with max(ConceptResult.id) if finish is not provided' do
      max_id = 10
      expect(ConceptResult).to receive(:maximum).with(:id).and_return(max_id)
      expect(CopyConceptResultsToResponsesWorker).to receive(:perform_async).with(1, max_id).once

      subject.perform(nil, nil)
    end
  end
end
