# frozen_string_literal: true

require 'rails_helper'

describe SaveActivitySessionConceptResultsWorker, type: :worker do

  context '#perform' do
    let(:old_concept_result) { create(:old_concept_result) }

    it 'should save new ConceptResult records based on an array of OldConceptResult ids' do
      expect { subject.perform([old_concept_result.id]) }
        .to change(ConceptResult, :count).by(1)
      expect(old_concept_result.concept_result).to be
    end

    it 'should create new ConceptResults that are related to the same ActivitySession as the original OldConceptResult' do
      subject.perform([old_concept_result.id])

      expect(old_concept_result.concept_result.activity_session).to eq(old_concept_result.activity_session)
    end

    it 'should re-enqueue old_concept_result.ids if new concept_results are not created' do
      expect(ConceptResult).to receive(:find_or_create_from_old_concept_result).and_return(nil)
      expect(SaveActivitySessionConceptResultsWorker).to receive(:perform_async).with([old_concept_result.id])

      subject.perform([old_concept_result.id])
    end
  end
end
