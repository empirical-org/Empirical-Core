# frozen_string_literal: true

require 'rails_helper'

describe SaveActivitySessionConceptResultsWorker, type: :worker do
  let(:child_worker_class) { SaveActivitySessionConceptResultWorker }

  context '#perform' do
    let(:activity_session) { create(:activity_session_without_concept_results) }
    let(:concept) { create(:concept) }
    let(:json_payload) {
      {
        activity_session_id: activity_session.id,
        concept_id: concept.id,
        question_type: "sentence-writing",
        metadata: {
          answer: "This is a response answer",
          attemptNumber: 1,
          correct: 1,
          directions: "This a student response directions 2.",
          instructions: "This a student response directions 2.",
          lastFeedback: "This a student response answer 2.",
          prompt: "This a student response prompt 2.",
          questionNumber: 1
        }
      }
    }

    it 'should call child worker once when passed a payload' do
      expect(child_worker_class).to receive(:perform_async).with(json_payload)
      subject.perform(json_payload)
    end

    it 'should call child worker twice when passed an array of two payloads' do
      expect(child_worker_class).to receive(:perform_async).with(json_payload).twice
      subject.perform([json_payload, json_payload])
    end

    it 'should create two concept results' do
      Sidekiq::Testing.inline! do
        subject.perform([json_payload, json_payload])
        expect(activity_session.reload.concept_results.count).to eq(2)
      end
    end
  end
end
