# frozen_string_literal: true

require 'rails_helper'

describe SaveActivitySessionOldConceptResultsWorker, type: :worker do

  context '#perform' do
    let(:json_payload) {
      {
        foo: 'bar'
      }
    }

    it 'should perform a direct pass-through to the SaveActivitySessionConceptResultsWorker which replaces this worker' do
      expect(SaveActivitySessionConceptResultsWorker).to receive(:perform_async).with(json_payload)
      subject.perform(json_payload)
    end
  end
end
