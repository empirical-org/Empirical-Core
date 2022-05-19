# frozen_string_literal: true

require 'rails_helper'

describe CopyConceptResultsToStudentResponsesWorker, type: :worker do

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
      expect { subject.perform([concept_result.id]) }.to change(StudentResponse, :count).by(1)

      student_response = concept_result.student_response

      expect(student_response.activity_session).to eq(concept_result.activity_session)
      expect(student_response.concepts).to eq([concept_result.concept])
      expect(student_response.correct).to be(true)
      expect(student_response.attempt_number).to eq(metadata[:attemptNumber])
      expect(student_response.question).to eq(question)
      expect(student_response.question_number).to eq(metadata[:questionNumber])
      expect(student_response.question_score).to eq(metadata[:questionScore])
      expect(student_response.student_response_answer_text.text).to eq(metadata[:answer])
      expect(student_response.student_response_directions_text.text).to eq(metadata[:directions])
      expect(student_response.student_response_instructions_text).to be(nil)
      expect(student_response.student_response_previous_feedback_text.text).to eq(metadata[:lastFeedback])
      expect(student_response.student_response_prompt_text.text).to eq(metadata[:prompt])
      expect(student_response.student_response_question_type.text).to eq(concept_result.question_type)
    end

    it 'should be idempotent so that if the same ID is present twice, only one new record is created' do

      expect { subject.perform([concept_result.id, concept_result.id]) }
        .to change(StudentResponse, :count).by(1)
        .and change(StudentResponse, :count).by(1)
    end
  end
end
