# frozen_string_literal: true

# == Schema Information
#
# Table name: responses
#
#  id                            :bigint           not null, primary key
#  attempt_number                :integer
#  correct                       :boolean          not null
#  extra_metadata                :json
#  question_number               :integer
#  question_score                :float
#  created_at                    :datetime         not null
#  activity_session_id           :bigint           not null
#  concept_result_id             :bigint
#  response_answer_id            :bigint
#  response_directions_id        :bigint
#  response_instructions_id      :bigint
#  response_previous_feedback_id :bigint
#  response_prompt_id            :bigint
#  response_question_type_id     :bigint
#
# Indexes
#
#  index_responses_on_concept_result_id  (concept_result_id) UNIQUE
#
require 'rails_helper'

RSpec.describe Response, type: :model do
  before do
    create(:response)
  end

  context 'associations' do
    it { should belong_to(:activity_session) }
    it { should belong_to(:question) }
    it { should belong_to(:response_answer) }
    it { should belong_to(:response_directions) }
    it { should belong_to(:response_instructions) }
    it { should belong_to(:response_previous_feedback) }
    it { should belong_to(:response_prompt) }
    it { should belong_to(:response_question_type) }

    it { should have_one(:response_extra_metadata).dependent(:destroy) }

    it { should have_many(:responses_concepts).dependent(:destroy) }
    it { should have_many(:concepts).through(:responses_concepts) }

    it { should have_many(:response_concept_results).dependent(:destroy) }
    it { should have_many(:concept_results).through(:response_concept_results) }
  end

  context 'validations' do
    it { should validate_exclusion_of(:correct).in_array([nil]) }
  end

  context 'methods' do
    context 'self.create_from_json' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:activity_session) { create(:activity_session_without_concept_results, activity: activity) }
      let(:concept) { create(:concept) }
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
      let(:json) do
        {
          "concept_uid": concept.uid,
          "question_type": "sentence-combining",
          "metadata": metadata,
          "concept_id": concept.id,
          "activity_session_id": activity_session.id
        }
      end

      it 'should create a new Response record' do
        expect do
          response = Response.create_from_json(json)
          expect(response.valid?).to be(true)
        end.to change(Response, :count).by(1)
      end

      it 'should store all input in the appropriate place' do
        response = Response.create_from_json(json)

        expect(response.activity_session).to eq(activity_session)
        expect(response.attempt_number).to eq(metadata[:attemptNumber])
        expect(response.correct).to eq(!metadata[:correct].zero?)
        expect(response.concepts).to eq([concept])
        expect(response.question_number).to eq(metadata[:questionNumber])
        expect(response.question_score).to eq(metadata[:questionScore])
        expect(response.response_answer.json).to eq(metadata[:answer])
        expect(response.response_directions.text).to eq(metadata[:directions])
        expect(response.response_prompt.text).to eq(metadata[:prompt])
        expect(response.response_previous_feedback.text).to eq(metadata[:lastFeedback])
        expect(response.response_question_type.text).to eq(json[:question_type])
      end

      it 'should create NormalizedText records when new text is provided' do
        expect { Response.create_from_json(json) }
          .to change(ResponseAnswer, :count).by(1)
          .and change(ResponseDirections, :count).by(1)
          .and change(ResponsePreviousFeedback, :count).by(1)
          .and change(ResponsePrompt, :count).by(1)
          .and change(ResponseQuestionType, :count).by(1)
          .and not_change(ResponseInstructions, :count)
        # No change expected above when "instructions" aren't in the payload
      end

      it 'should not link to records when the appropriate keys are not provided' do
        response = Response.create_from_json(json)

        expect(response.reload.response_instructions).to be_nil
      end

      it 'should not link to records when the value in the key is an empty string' do
        response = Response.create_from_json(json.merge({question_type: nil}))

        expect(response.reload.response_question_type).to be_nil
      end

      it 'should find existing NormalizedText records when existing text is provided' do
        create(:response_answer, json: metadata[:answer])
        create(:response_directions, text: metadata[:directions])
        expect { Response.create_from_json(json) }
          .to not_change(ResponseAnswer, :count)
          .and not_change(ResponseDirections, :count)
      end

      it 'should assign concept_ids if provided only singular concept_id key' do
        expect(json).not_to have_key(:concept_ids)
        response = Response.create_from_json(json)

        expect(response.concepts.length).to eq(1)
        expect(response.concepts).to include(concept)
      end

      it 'should create multiple ResponsesConcepts if multiple concept_ids are provided' do
        concept2 = create(:concept)
        json[:concept_ids] = [json[:concept_id], concept2.id]

        response = Response.create_from_json(json)

        expect(response.concepts.length).to eq(2)
        expect(response.concepts).to include(concept, concept2)
      end

      it 'should only create a single ResponseConcepts record per id, ignoring duplicates' do
        json[:concept_ids] = [json[:concept_id], json[:concept_id]]

        response = Response.create_from_json(json)

        expect(response.concepts.length).to eq(1)
        expect(response.concepts).to include(concept)
      end

      it 'should create a related ResponseExtraMetadata record containing any keys not part of the normalization process' do
        extra_metadata = {'foo' => 'bar', 'baz' => 'qux'}
        metadata.merge!(extra_metadata)

        expect do
          response = Response.create_from_json(json)
          expect(response.response_extra_metadata.metadata).to eq(extra_metadata)
        end.to change(ResponseExtraMetadata, :count).by(1)
      end

      it 'should not create ExtraMetadata records if no unknown keys are provided' do
        expect(ResponseExtraMetadata.count).to eq(0)
        expect { Response.create_from_json(json) }
          .not_to change(ResponseExtraMetadata, :count).from(0)
      end
    end

    context 'self.find_or_create_from_concept_result' do
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
      let(:concept_result) { create(:sentence_combining, activity_session: activity_session, metadata: metadata) }

      it 'should create a new Response if none exists for the activity_session-attempt_number-question_number combination of the source ConceptResult' do
        expect do
          response = Response.find_or_create_from_concept_result(concept_result)
          expect(response.valid?).to be(true)
        end.to change(Response, :count).by(1)
      end

      it 'should return early if the concept_result is already in a response_concept_results record' do
        create(:response_concept_result, concept_result: concept_result)

        expect(Response).not_to receive(:find_by)
        Response.find_or_create_from_concept_result(concept_result)
      end

      it 'should attach a new Concept to an existing Response if one exists for the activity_session-attempt_number-question_number combination of the ConceptResult' do
        different_concept = create(:concept)
        response = create(:response,
          activity_session: concept_result.activity_session,
          attempt_number: metadata[:attemptNumber],
          concepts: [different_concept],
          question_number: metadata[:questionNumber])
        expect do
          new_response = Response.find_or_create_from_concept_result(concept_result)
          expect(new_response).to eq(response.reload)
          expect(response.concepts).to include(concept_result.concept, different_concept)
        end.to not_change(Response, :count)
           .and change { response.reload.concepts.length }.by(1)
      end

      it 'should create a new ResponseConceptResult record if one is missing, even if no other records are created or modified' do
        response = create(:response,
          activity_session: concept_result.activity_session,
          attempt_number: metadata[:attemptNumber],
          concepts: [concept_result.concept],
          question_number: metadata[:questionNumber])

        expect { Response.find_or_create_from_concept_result(concept_result) }
          .to not_change(Response, :count)
          .and not_change(response.reload.concepts, :length)
          .and change(ResponseConceptResult, :count).by(1)
      end

      it 'should add a new ResponseConceptResult record to an existing Response if one exists with the same activity_session, question_number, and attempt_number' do
        extra_concept_result = create(:sentence_combining, activity_session: activity_session, metadata: metadata)
        response = create(:response,
          activity_session: concept_result.activity_session,
          attempt_number: metadata[:attemptNumber],
          concepts: [concept_result.concept],
          question_number: metadata[:questionNumber],
          concept_results: [extra_concept_result])

        expect(response.concept_results).to eq([extra_concept_result])
        expect { Response.find_or_create_from_concept_result(concept_result) }
          .to not_change(Response, :count)
          .and not_change(response.reload.concepts, :length)
          .and change(ResponseConceptResult, :count).by(1)
        expect(response.concept_results).to include(concept_result, extra_concept_result)
      end
    end

    context 'self.bulk_create_from_json' do
      let(:question1) { create(:question) }
      let(:question2) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question1.uid},{key: question2.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:concept) { create(:concept) }
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
      let(:json) do
        {
          "concept_uid": concept.uid,
          "question_type": "sentence-combining",
          "metadata": metadata,
          "concept_id": concept.id,
          "activity_session_id": activity_session.id
        }
      end

      it 'should create new records from an array of JSON objects' do
        json2 = json.deep_dup
        json2[:metadata][:questionNumber] = 2

        expect do
          response = Response.bulk_create_from_json([json, json2])
          expect(response.all?(&:valid?)).to be(true)
        end.to change(Response, :count).by(2)
      end

      it 'should consolidate same attempt-question number records into a single Response record' do
        json2 = json.deep_dup
        json2[:concept_id] = create(:concept).id

        expect do
          response = Response.bulk_create_from_json([json, json2])
          expect(response.all?(&:valid?)).to be(true)
        end.to change(Response, :count).by(1)
           .and change(ResponsesConcept, :count).by(2)
      end
    end

    context 'self.legacy_format' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:concept) { create(:concept) }
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
      let(:concept_result) { create(:sentence_combining, concept: concept, activity_session: activity_session, concept_uid: concept.uid, metadata: metadata, activity_classification_id: activity.activity_classification_id) }

      it 'should return data in the same shape as a ConceptResult' do
        response = Response.find_or_create_from_concept_result(concept_result)

        expect(response.legacy_format.first.except(:id)).to eq(concept_result.as_json.deep_symbolize_keys.except(:id))
      end

      it 'should return an array of hashes shaped like ConceptResults when a Response has multiple concepts' do
        concept2 = create(:concept)
        concept_result2 = create(:sentence_combining, concept: concept2, activity_session: activity_session, concept_uid: concept2.uid, metadata: metadata, activity_classification_id: activity.activity_classification_id)
        Response.find_or_create_from_concept_result(concept_result)
        response = Response.find_or_create_from_concept_result(concept_result2)

        payload = response.legacy_format

        expect(payload.length).to eq(2)
        expect(payload.map { |h| h[:concept_id] }).to include(concept.id, concept2.id)
      end
    end

    context 'self.calculate_question_from_hash' do
      let(:question) { create(:question) }
      let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
      let(:activity_session) { create(:activity_session, activity: activity) }
      let(:concept) { create(:concept) }
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
      let(:json) do
        {
          "concept_uid": concept.uid,
          "question_type": "sentence-combining",
          "metadata": metadata,
          "concept_id": concept.id,
          "activity_session_id": activity_session.id
        }
      end

      it 'should calculate a question successfully if the question_uid is in the source' do
        payload = json.deep_dup
        payload[:metadata].delete(:questionNumber)
        payload[:question_uid] = question.uid
        response = Response.create_from_json(payload)

        expect(response.question).to eq(question)
      end

      it 'should calculate a question successfully if the questionUid is in the source' do
        payload = json.deep_dup
        payload[:metadata].delete(:questionNumber)
        payload[:questionUid] = question.uid

        response = Response.create_from_json(payload)

        expect(response.question).to eq(question)
      end

      it 'should calculate a question successfully if the source metadata has a questionNumber' do
        response = Response.create_from_json(json)

        expect(response.question).to eq(question)
      end

      it 'should calculate a null value if there is not question_uid or questionNumber available' do
        payload = json.deep_dup
        payload[:metadata].delete(:questionNumber)

        response = Response.create_from_json(payload)

        expect(response.question).to be(nil)
      end
    end
  end

  context 'performance benchmarking', :benchmarking do
    let(:question) { create(:question) }
    let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
    let(:samples) { 100 }
    let!(:concept_results) do
      samples.times do |i|
        metadata = {
          "correct": 1,
          "directions": "Combine the sentences. (And)#{rand(10)}",
          "lastFeedback": "Proofread your work. Check your spelling.#{rand(10)}",
          "prompt": "Deserts are very dry. Years go by without rain.#{rand(10)}",
          "attemptNumber": rand(1..10),
          "answer": "Deserts are very dry, and years go by without rain.#{rand(10)}",
          "questionNumber": 1,
          "questionScore": 0.8
        }
        activity_session = create(:activity_session_without_concept_results, activity: activity)
        create(:sentence_combining, activity_session: activity_session, metadata: metadata)
      end
    end

    it 'performance migration from ConceptResults' do
      runtime = Benchmark.realtime do
        ConceptResult.all.each do |cr|
          Response.find_or_create_from_concept_result(cr)
        end
      end
      puts format('Average ConceptResult migration runtime for %<count> items: %<runtime>.3f seconds', {runtime: (runtime / ConceptResult.count), count: ConceptResult.count})
      expect(ResponseConceptResult.count).to eq(ConceptResult.count)
    end
  end
end
