# frozen_string_literal: true

require 'rails_helper'

describe BatchSaveActivitySessionConceptResultsWorker, type: :worker do
  describe '#perform' do
    let(:activity_session_id) { 1 }
    let(:activity_session_uid) { 'unique_id' }
    let(:concept1) { create(:concept, uid: 'concept1') }
    let(:concept2) { create(:concept, uid: 'concept2') }
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

  describe '#on_complete' do
    let(:activity_session_uid) { 'unique_id' }
    let(:options) { { 'activity_session_uid' => activity_session_uid } }

    let(:classroom_unit) {create(:classroom_unit)}
    let(:activity_session) {create(:activity_session, uid: activity_session_uid, classroom_unit: classroom_unit)}
    let(:user_id) { activity_session.user_id }
    let(:cache_key) { User.student_scores_cache_key(user_id, classroom_unit.classroom_id)}

    context 'when all jobs succeed' do
      let(:status) { double('status', failures: 0, total: 2) }

      it 'triggers Pusher event for success' do
        expect(Rails.cache).to receive(:delete).with(cache_key).once
        expect(PusherTrigger).to receive(:run).with(
          activity_session_uid,
          'concept-results-saved',
          "Concept results saved for activity session with uid: #{activity_session_uid}"
        )
        subject.on_complete(status, options)
      end
    end

    context 'when some jobs fail' do
      let(:status) { double('status', failures: 1, total: 2) }

      it 'triggers Pusher event for partial success' do
        expect(Rails.cache).to receive(:delete).with(cache_key).once
        expect(PusherTrigger).to receive(:run).with(
          activity_session_uid,
          'concept-results-partially-saved',
          "Concept results partially saved for activity session with uid: #{activity_session_uid}, 1 succeeded, 1 failed"
        )
        subject.on_complete(status, options)
      end
    end
  end
end
