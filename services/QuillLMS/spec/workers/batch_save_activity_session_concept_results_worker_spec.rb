# frozen_string_literal: true

require 'rails_helper'

describe BatchSaveActivitySessionConceptResultsWorker, type: :worker do
  describe '#perform' do
    let(:activity_session_id) { 1 }
    let(:activity_session_uid) { 'unique_id' }
    let(:concept1) { create(:concept, uid: 'concept1' )}
    let(:concept2) { create(:concept, uid: 'concept2' )}
    let(:concept_results) do
      [
        { 'concept_uid' => concept1.uid, 'correct' => true },
        { 'concept_uid' => concept2.uid, 'correct' => false }
      ]
    end

    it 'processes concept results and enqueues jobs' do
      expect {
        subject.perform(concept_results, activity_session_id, activity_session_uid)
      }.to change(SaveActivitySessionConceptResultsWorker.jobs, :size).by(concept_results.size)
    end
  end

  describe '#on_success' do
    let(:activity_session_uid) { 'unique_id' }
    let(:options) { { 'activity_session_uid' => activity_session_uid } }

    it 'triggers Pusher event' do
      expect(PusherTrigger).to receive(:run).with(activity_session_uid, 'concept-results-saved', anything)
      subject.on_success(nil, options)
    end
  end
end
