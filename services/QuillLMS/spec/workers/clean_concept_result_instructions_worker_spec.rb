# frozen_string_literal: true

require 'rails_helper'

describe CleanConceptResultInstructionsWorker, type: :worker do

  context '#perform' do
    let(:concept_result_instructions) { create(:concept_result_instructions) }
    let!(:concept_result) { create(:concept_result, concept_result_instructions: concept_result_instructions, extra_metadata: {'instructions': concept_result_instructions.text}) }

    it 'should delete the instructions value in extra_metadata if it is just a copy of the normalized value' do
      expect_any_instance_of(ConceptResult).to receive(:update).with(extra_metadata: {}).and_call_original

      subject.perform(concept_result.id, concept_result.id)

      expect(concept_result.reload.extra_metadata['instructions']).to be(nil)
    end

    it 'should return early if the ConceptResult has no normalized instructions' do
      concept_result.update(concept_result_instructions: nil)

      expect_any_instance_of(ConceptResult).not_to receive(:save!)

      subject.perform(concept_result.id, concept_result.id)
    end

    it 'should return early if normalized instructions are different from the value in extra_metadata' do
      concept_result_instructions.update(text: 'This is new text that definitely was not there before.')

      expect_any_instance_of(ConceptResult).not_to receive(:save!)

      subject.perform(concept_result.id, concept_result.id)
    end
  end
end
