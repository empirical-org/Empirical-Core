# frozen_string_literal: true

require 'rails_helper'

describe SaveActivitySessionConceptResultsWorker, type: :worker do

  context '#perform' do
    let(:old_concept_result) { create(:old_concept_result) }

    it 'should save new ConceptResult records based on an array of OldConceptResult ids' do
      expect { subject.perform(old_concept_result.id) }
        .to change(ConceptResult, :count).by(1)
      puts old_concept_result.reload.as_json
      puts ConceptResult.all.as_json
      expect(old_concept_result.reload.concept_result).to be
    end
  end
end
