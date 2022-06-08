# frozen_string_literal: true

# == Schema Information
#
# Table name: responses
#
#  id                            :bigint           not null, primary key
#  answer                        :jsonb
#  attempt_number                :integer
#  correct                       :boolean          not null
#  extra_metadata                :jsonb
#  question_number               :integer
#  question_score                :float
#  created_at                    :datetime         not null
#  activity_session_id           :integer          not null
#  concept_id                    :integer
#  concept_result_id             :integer
#  response_directions_id        :integer
#  response_instructions_id      :integer
#  response_previous_feedback_id :integer
#  response_prompt_id            :integer
#  response_question_type_id     :integer
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
    it { should belong_to(:concept) }
    it { should belong_to(:concept_result) }
    it { should belong_to(:response_directions) }
    it { should belong_to(:response_instructions) }
    it { should belong_to(:response_previous_feedback) }
    it { should belong_to(:response_prompt) }
    it { should belong_to(:response_question_type) }
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
        expect(response.concept).to eq(concept)
        expect(response.question_number).to eq(metadata[:questionNumber])
        expect(response.question_score).to eq(metadata[:questionScore])
        expect(response.answer).to eq(metadata[:answer])
        expect(response.response_directions.text).to eq(metadata[:directions])
        expect(response.response_prompt.text).to eq(metadata[:prompt])
        expect(response.response_previous_feedback.text).to eq(metadata[:lastFeedback])
        expect(response.response_question_type.text).to eq(json[:question_type])
      end

      it 'should create NormalizedText records when new text is provided' do
        expect { Response.create_from_json(json) }
          .to change(ResponseDirections, :count).by(1)
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
        create(:response_directions, text: metadata[:directions])
        expect { Response.create_from_json(json) }
          .to not_change(ResponseDirections, :count)
      end

      it 'should extra_metadata containing any keys not part of the normalization process' do
        extra_metadata = {'foo' => 'bar', 'baz' => 'qux'}
        metadata.merge!(extra_metadata)

        response = Response.create_from_json(json)
        expect(response.extra_metadata).to eq(extra_metadata)
      end

      it 'should leave extra_metadat nil if no unknown keys are provided' do
        response = Response.create_from_json(json)
        expect(response.extra_metadata).to be(nil)
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
        create(:response, concept_result: concept_result)

        expect(Response).not_to receive(:create_from_json)
        Response.find_or_create_from_concept_result(concept_result)
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

        expect(response.legacy_format.except(:id)).to eq(concept_result.as_json.deep_symbolize_keys.except(:id))
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
