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

    it { should have_one(:student_response_extra_metadata) }

    it { should have_many(:student_responses_concepts) }
    it { should have_many(:concepts).through(:student_responses_concepts) }

    it { should have_many(:student_response_concept_results) }
    it { should have_many(:concept_results).through(:student_response_concept_results) }
  end

  context 'validations' do
    it { should validate_presence_of(:attempt_number) }
    it { should validate_presence_of(:question_number) }
    it { should validate_inclusion_of(:correct).in_array([true, false]) }
  end

  context 'methods' do
    context 'self.create_from_json' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:concept) { create(:concept) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:json) { {
        "concept_uid":concept.uid,
        "question_type":"sentence-combining",
        "metadata":{
          "correct":1,
          "directions":"Combine the sentences. (And)",
          "lastFeedback":"Proofread your work. Check your spelling.",
          "prompt":"Deserts are very dry. Years go by without rain.",
          "attemptNumber":2,
          "answer":"Deserts are very dry, and years go by without rain.",
          "questionNumber":1,
          "questionScore":0.8
        },
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
        metadata = json[:metadata]

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

      end

      it 'should assign concept_ids if provided only singular concept_id key' do

      end

      it 'should create multiple StudentResponsesConcepts if multiple concept_ids are provided' do

      end

      it 'should create a related StudentResponseExtraMetadata record containing any keys not part of the normalization process' do

      end

      it 'should not create ExtraMetadata records if no unknown keys are provided' do
        expect(StudentResponseExtraMetadata.count).to eq(0)
        expect { StudentResponse.create_from_json(json) }
          .not_to change { StudentResponseExtraMetadata.count }.from(0)
      end
    end

    context 'self.create_from_concept_result' do
      it 'should return early if the concept_result is already in a student_response_concept_results record' do

      end

      it 'should create a new StudentResponse if none exists for the activity_session-attempt_number-question_number combination of the source ConceptResult' do
      end

      it 'should attach a new Concept to an existing StudentResponse if one exists for the activity_session-attempt_number-question_number combination of the ConceptResult' do

      end

      it 'should create a new StudentResponseConceptResults record if one is missing, even if no other records are created or modified' do

      end
    end

    context 'self.bulk_create_from_json' do
      it 'should create new records from an array of JSON objects' do

      end

      it 'should consolidate same attempt-question number records into a single StudentResponse record' do

      end
    end

    context 'self.legacy_format' do
      it 'should return data in the same shape as a ConceptResult' do

      end
    end
  end
end
