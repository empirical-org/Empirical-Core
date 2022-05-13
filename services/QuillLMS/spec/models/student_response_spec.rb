# frozen_string_literal: true

# == Schema Information
#
# Table name: student_responses
#
#  id                                         :bigint           not null, primary key
#  attempt_number                             :integer          not null
#  correct                                    :boolean          not null
#  question_number                            :integer          not null
#  question_score                             :float
#  created_at                                 :datetime         not null
#  activity_session_id                        :bigint           not null
#  question_id                                :bigint           not null
#  student_response_answer_text_id            :bigint           not null
#  student_response_directions_text_id        :bigint           not null
#  student_response_instructions_text_id      :bigint           not null
#  student_response_previous_feedback_text_id :bigint           not null
#  student_response_prompt_text_id            :bigint           not null
#  student_response_question_type_id          :bigint           not null
#
# Indexes
#
#  idx_student_responses_on_student_response_instructions_text_id  (student_response_instructions_text_id)
#  idx_student_responses_on_student_response_previous_feedback_id  (student_response_previous_feedback_text_id)
#  index_student_responses_on_activity_session_id                  (activity_session_id)
#  index_student_responses_on_question_id                          (question_id)
#  index_student_responses_on_student_response_answer_text_id      (student_response_answer_text_id)
#  index_student_responses_on_student_response_directions_text_id  (student_response_directions_text_id)
#  index_student_responses_on_student_response_prompt_text_id      (student_response_prompt_text_id)
#  index_student_responses_on_student_response_question_type_id    (student_response_question_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_session_id => activity_sessions.id)
#  fk_rails_...  (student_response_answer_text_id => student_response_answer_texts.id)
#  fk_rails_...  (student_response_directions_text_id => student_response_directions_texts.id)
#  fk_rails_...  (student_response_instructions_text_id => student_response_instructions_texts.id)
#  fk_rails_...  (student_response_previous_feedback_text_id => student_response_previous_feedback_texts.id)
#  fk_rails_...  (student_response_prompt_text_id => student_response_prompt_texts.id)
#  fk_rails_...  (student_response_question_type_id => student_response_question_types.id)
#
require 'rails_helper'

RSpec.describe StudentResponse, type: :model do
  before do
    create(:student_response)
  end

  context 'associations' do
    it { should belong_to(:activity_session) }
    it { should belong_to(:question) }
    it { should belong_to(:student_response_answer_text) }
    it { should belong_to(:student_response_directions_text) }
    it { should belong_to(:student_response_instructions_text) }
    it { should belong_to(:student_response_previous_feedback_text) }
    it { should belong_to(:student_response_prompt_text) }
    it { should belong_to(:student_response_question_type) }

    it { should have_one(:student_response_extra_metadata).dependent(:destroy) }

    it { should have_many(:student_responses_concepts).dependent(:destroy) }
    it { should have_many(:concepts).through(:student_responses_concepts) }

    it { should have_one(:student_response_concept_result).dependent(:destroy) }
    it { should have_one(:concept_result).through(:student_response_concept_result) }
  end

  context 'validations' do
    it { should validate_presence_of(:attempt_number) }
    it { should validate_presence_of(:question_number) }
    it { should validate_exclusion_of(:correct).in_array([nil]) }
  end

  context 'methods' do
    context 'self.create_from_json' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:concept) { create(:concept) }
      let(:metadata) { {
        "correct":1,
        "directions":"Combine the sentences. (And)",
        "lastFeedback":"Proofread your work. Check your spelling.",
        "prompt":"Deserts are very dry. Years go by without rain.",
        "attemptNumber":2,
        "answer":"Deserts are very dry, and years go by without rain.",
        "questionNumber":1,
        "questionScore":0.8
      } }
      let(:json) { {
        "concept_uid":concept.uid,
        "question_type":"sentence-combining",
        "metadata":metadata,
        "concept_id":concept.id,
        "activity_session_id":activity_session.id
      } }

      it 'should create a new StudentResponse record' do
        expect do
          response = StudentResponse.create_from_json(json)
          expect(response.valid?).to be(true)
        end.to change { StudentResponse.count }.by(1)
      end

      it 'should store all input in the appropriate place' do
        response = StudentResponse.create_from_json(json)

        expect(response.activity_session).to eq(activity_session)
        expect(response.attempt_number).to eq(metadata[:attemptNumber])
        expect(response.correct).to eq(!metadata[:correct].zero?)
        expect(response.concepts).to eq([concept])
        expect(response.question_number).to eq(metadata[:questionNumber])
        expect(response.question_score).to eq(metadata[:questionScore])
        expect(response.student_response_answer_text.answer).to eq(metadata[:answer])
        expect(response.student_response_directions_text.text).to eq(metadata[:directions])
        expect(response.student_response_prompt_text.text).to eq(metadata[:prompt])
        expect(response.student_response_previous_feedback_text.text).to eq(metadata[:lastFeedback])
        expect(response.student_response_question_type.text).to eq(json[:question_type])
      end

      it 'should create NormalizedText records when new text is provided' do
        expect { StudentResponse.create_from_json(json) }
          .to change { StudentResponseAnswerText.count }.by(1)
          .and change { StudentResponseDirectionsText.count }.by(1)
          .and change { StudentResponseInstructionsText.count }.by(1)
          .and change { StudentResponsePreviousFeedbackText.count }.by(1)
          .and change { StudentResponsePromptText.count }.by(1)
          .and change { StudentResponseQuestionType.count }.by(1)
      end

      it 'should link to empty-string instances of NormalizedText records when the appropriate keys are not provided' do
        response = StudentResponse.create_from_json(json)
        metadata = json[:metadata]

        expect(response.student_response_instructions_text.text).to eq('')
      end

      it 'should find existing NormalizedText records when existing text is provided' do
        create(:student_response_answer_text, answer: metadata[:answer])
        create(:student_response_directions_text, text: metadata[:directions])
        expect { StudentResponse.create_from_json(json) }
          .to not_change { StudentResponseAnswerText.count }
          .and not_change { StudentResponseDirectionsText.count }
      end

      it 'should assign concept_ids if provided only singular concept_id key' do
        expect(json).not_to have_key(:concept_ids)
        response = StudentResponse.create_from_json(json)

        expect(response.concepts.length).to eq(1)
        expect(response.concepts).to include(concept)
      end

      it 'should create multiple StudentResponsesConcepts if multiple concept_ids are provided' do
        concept2 = create(:concept)
        json[:concept_ids] = [json[:concept_id], concept2.id]

        response = StudentResponse.create_from_json(json)

        expect(response.concepts.length).to eq(2)
        expect(response.concepts).to include(concept, concept2)
      end

      it 'should only create a single StudentResponseConcepts record per id, ignoring duplicates' do
        json[:concept_ids] = [json[:concept_id], json[:concept_id]]

        response = StudentResponse.create_from_json(json)

        expect(response.concepts.length).to eq(1)
        expect(response.concepts).to include(concept)
      end

      it 'should create a related StudentResponseExtraMetadata record containing any keys not part of the normalization process' do
        extra_metadata = {'foo' => 'bar', 'baz' => 'qux'}
        metadata.merge!(extra_metadata)

        expect do
          response = StudentResponse.create_from_json(json)
          expect(response.student_response_extra_metadata.metadata).to eq(extra_metadata)
        end.to change { StudentResponseExtraMetadata.count }.by(1)
      end

      it 'should not create ExtraMetadata records if no unknown keys are provided' do
        expect(StudentResponseExtraMetadata.count).to eq(0)
        expect { StudentResponse.create_from_json(json) }
          .not_to change { StudentResponseExtraMetadata.count }.from(0)
      end
    end

    context 'self.create_from_concept_result' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:metadata) { {
        "correct":1,
        "directions":"Combine the sentences. (And)",
        "lastFeedback":"Proofread your work. Check your spelling.",
        "prompt":"Deserts are very dry. Years go by without rain.",
        "attemptNumber":2,
        "answer":"Deserts are very dry, and years go by without rain.",
        "questionNumber":1,
        "questionScore":0.8
      } }
      let(:concept_result) { create(:sentence_combining, activity_session: activity_session, metadata: metadata) }

      it 'should create a new StudentResponse if none exists for the activity_session-attempt_number-question_number combination of the source ConceptResult' do
        expect do
          response = StudentResponse.create_from_concept_result(concept_result)
          expect(response.valid?).to be(true)
        end.to change { StudentResponse.count }.by(1)
      end

      it 'should return early if the concept_result is already in a student_response_concept_results record' do
        create(:student_response_concept_result, concept_result: concept_result)

        expect(StudentResponse).not_to receive(:find_by)
        StudentResponse.create_from_concept_result(concept_result)
      end

      it 'should attach a new Concept to an existing StudentResponse if one exists for the activity_session-attempt_number-question_number combination of the ConceptResult' do
        different_concept = create(:concept)
        student_response = create(:student_response,
          activity_session: concept_result.activity_session,
          attempt_number: metadata[:attemptNumber],
          concepts: [different_concept],
          question_number: metadata[:questionNumber],)
        expect do
          response = StudentResponse.create_from_concept_result(concept_result)
          expect(response).to eq(student_response)
          expect(response.concepts).to include(concept_result.concept, different_concept)
        end.to not_change { StudentResponse.count }
           .and change { student_response.reload.concepts.length }.by(1)
      end

      it 'should create a new StudentResponseConceptResult record if one is missing, even if no other records are created or modified' do
        student_response = create(:student_response,
          activity_session: concept_result.activity_session,
          attempt_number: metadata[:attemptNumber],
          concepts: [concept_result.concept],
          question_number: metadata[:questionNumber],)

        expect { StudentResponse.create_from_concept_result(concept_result) }
          .to not_change { StudentResponse.count }
          .and not_change { student_response.reload.concepts.length }
          .and change { StudentResponseConceptResult.count }.by(1)
      end
    end

    context 'self.bulk_create_from_json' do
      let(:question1) { create(:question) }
      let(:question2) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question1.uid},{key: question2.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:concept) { create(:concept) }
      let(:metadata) { {
        "correct":1,
        "directions":"Combine the sentences. (And)",
        "lastFeedback":"Proofread your work. Check your spelling.",
        "prompt":"Deserts are very dry. Years go by without rain.",
        "attemptNumber":2,
        "answer":"Deserts are very dry, and years go by without rain.",
        "questionNumber":1,
        "questionScore":0.8
      } }
      let(:json) { {
        "concept_uid":concept.uid,
        "question_type":"sentence-combining",
        "metadata":metadata,
        "concept_id":concept.id,
        "activity_session_id":activity_session.id
      } }

      it 'should create new records from an array of JSON objects' do
        json2 = json.deep_dup
        json2[:metadata][:questionNumber] = 2

        expect do
          response = StudentResponse.bulk_create_from_json([json, json2])
          expect(response.all?(&:valid?)).to be(true)
        end.to change { StudentResponse.count }.by(2)
      end

      it 'should consolidate same attempt-question number records into a single StudentResponse record' do
        json2 = json.deep_dup
        json2[:concept_id] = create(:concept).id

        expect do
          response = StudentResponse.bulk_create_from_json([json, json2])
          expect(response.all?(&:valid?)).to be(true)
        end.to change { StudentResponse.count }.by(1)
           .and change { StudentResponsesConcept.count }.by(2)
      end
    end

    context 'self.legacy_format' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:concept) { create(:concept) }
      let(:metadata) { {
        "correct":1,
        "directions":"Combine the sentences. (And)",
        "lastFeedback":"Proofread your work. Check your spelling.",
        "prompt":"Deserts are very dry. Years go by without rain.",
        "attemptNumber":2,
        "answer":"Deserts are very dry, and years go by without rain.",
        "questionNumber":1,
        "questionScore":0.8
      } }
      let(:concept_result) { create(:sentence_combining, concept: concept, activity_session: activity_session, concept_uid: concept.uid, metadata: metadata, activity_classification_id: activity.activity_classification_id) }

      it 'should return data in the same shape as a ConceptResult' do
        student_response = StudentResponse.create_from_concept_result(concept_result)

        expect(student_response.legacy_format.first.except(:id)).to eq(concept_result.as_json.deep_symbolize_keys.except(:id))
      end

      it 'should return an array of hashes shaped like ConceptResults when a StudentResponse has multiple concepts' do
        concept2 = create(:concept)
        concept_result2 = create(:sentence_combining, concept: concept2, activity_session: activity_session, concept_uid: concept2.uid, metadata: metadata, activity_classification_id: activity.activity_classification_id)
        StudentResponse.create_from_concept_result(concept_result)
        student_response = StudentResponse.create_from_concept_result(concept_result2)

        payload = student_response.legacy_format

        expect(payload.length).to eq(2)
        expect(payload.map { |h| h[:concept_id] }).to include(concept.id, concept2.id)
      end
    end
  end
end
