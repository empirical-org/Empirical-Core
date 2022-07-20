# frozen_string_literal: true

require 'rails_helper'

describe CopyOldConceptResultsToConceptResultsWorker, type: :worker do

  context '#perform' do
    it 'should enqueue CopySingleConceptResultWorker job for each id passed in' do
      min_id = 1
      max_id = 5
      (min_id..max_id).each do |id|
        expect(CopySingleConceptResultWorker).to receive(:perform_async).once.with(id)
      end

      subject.perform(min_id, max_id)
    end
  end
end
