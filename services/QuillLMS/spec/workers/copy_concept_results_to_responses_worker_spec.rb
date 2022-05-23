# frozen_string_literal: true

require 'rails_helper'

describe CopyConceptResultsToResponsesWorker, type: :worker do

  context '#perform' do
    let(:question) { create(:question) }
    let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
    let(:activity_session) { create(:activity_session, activity: activity) }
    let(:metadata) do
      {
        "correct": 1,
        "directions": "Combine the sentences. (And)",
        "lastFeedback": "Proofread your work. Check your spelling.",
        "prompt": "Deserts are very dry. Years go by without rain.",
        "attemptNumber": 2,
        "answer": "Deserts are very dry, and years go by without rain.",
        "questionNumber": 1,
        "questionScore": 0.8
      }
    end
    let(:concept_result) { create(:sentence_combining, metadata: metadata, activity_session: activity_session) }

    it 'should create a Student Response record with Normalized Texts' do
      expect { subject.perform([concept_result.id]) }.to change(Response, :count).by(1)

      response = concept_result.response

      expect(response.activity_session).to eq(concept_result.activity_session)
      expect(response.concepts).to eq([concept_result.concept])
      expect(response.correct).to be(true)
      expect(response.attempt_number).to eq(metadata[:attemptNumber])
      expect(response.question).to eq(question)
      expect(response.question_number).to eq(metadata[:questionNumber])
      expect(response.question_score).to eq(metadata[:questionScore])
      expect(response.response_answer.json).to eq(metadata[:answer])
      expect(response.response_directions.text).to eq(metadata[:directions])
      expect(response.response_instructions).to be(nil)
      expect(response.response_previous_feedback.text).to eq(metadata[:lastFeedback])
      expect(response.response_prompt.text).to eq(metadata[:prompt])
      expect(response.response_question_type.text).to eq(concept_result.question_type)
    end

    it 'should be idempotent so that if the same ID is present twice, only one new record is created' do

      expect { subject.perform([concept_result.id, concept_result.id]) }
        .to change(Response, :count).by(1)
        .and change(Response, :count).by(1)
    end
  end
end
