# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_results
#
#  id                                  :bigint           not null, primary key
#  answer                              :jsonb
#  attempt_number                      :integer
#  correct                             :boolean          not null
#  extra_metadata                      :jsonb
#  question_number                     :integer
#  question_score                      :float
#  created_at                          :datetime         not null
#  activity_session_id                 :integer          not null
#  concept_id                          :integer
#  concept_result_directions_id        :integer
#  concept_result_instructions_id      :integer
#  concept_result_previous_feedback_id :integer
#  concept_result_prompt_id            :integer
#  concept_result_question_type_id     :integer
#  old_concept_result_id               :integer
#
# Indexes
#
#  index_concept_results_on_activity_session_id    (activity_session_id)
#  index_concept_results_on_old_concept_result_id  (old_concept_result_id) UNIQUE
#
require 'rails_helper'

RSpec.describe ConceptResult, type: :model do
  before do
    create(:concept_result)
  end

  context 'associations' do
    it { should belong_to(:activity_session) }
    it { should belong_to(:concept) }
    it { should belong_to(:old_concept_result) }
    it { should belong_to(:concept_result_directions) }
    it { should belong_to(:concept_result_instructions) }
    it { should belong_to(:concept_result_previous_feedback) }
    it { should belong_to(:concept_result_prompt) }
    it { should belong_to(:concept_result_question_type) }
  end

  context 'validations' do
    it { should validate_inclusion_of(:correct).in_array([true, false]) }
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
          "instructions": "Combine the sentences. (And)",
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

      it 'should create a new ConceptResult record' do
        expect do
          concept_result = ConceptResult.create_from_json(json)
          expect(concept_result.valid?).to be(true)
        end.to change(ConceptResult, :count).by(1)
      end

      it 'should store all input in the appropriate place' do
        response = ConceptResult.create_from_json(json)

        expect(response.activity_session).to eq(activity_session)
        expect(response.attempt_number).to eq(metadata[:attemptNumber])
        expect(response.correct).to eq(!metadata[:correct].zero?)
        expect(response.concept).to eq(concept)
        expect(response.question_number).to eq(metadata[:questionNumber])
        expect(response.question_score).to eq(metadata[:questionScore])
        expect(response.answer).to eq(metadata[:answer])
        expect(response.concept_result_directions.text).to eq(metadata[:directions])
        expect(response.concept_result_prompt.text).to eq(metadata[:prompt])
        expect(response.concept_result_previous_feedback.text).to eq(metadata[:lastFeedback])
        expect(response.concept_result_question_type.text).to eq(json[:question_type])
      end

      it 'should create NormalizedText records when new text is provided' do
        expect do
          cr =  ConceptResult.create_from_json(json)
          expect(cr.extra_metadata).to be(nil)
        end.to change(ConceptResultDirections, :count).by(1)
          .and change(ConceptResultPreviousFeedback, :count).by(1)
          .and change(ConceptResultPrompt, :count).by(1)
          .and change(ConceptResultQuestionType, :count).by(1)
          .and change(ConceptResultInstructions, :count).by(1)
      end

      it 'should not link to records when the appropriate keys are not provided' do
        json[:metadata].delete(:instructions)
        concept_result = ConceptResult.create_from_json(json)

        expect(concept_result.reload.concept_result_instructions).to be_nil
      end

      it 'should not link to records when the value in the key is an empty string' do
        concept_result = ConceptResult.create_from_json(json.merge({question_type: nil}))

        expect(concept_result.reload.concept_result_question_type).to be_nil
      end

      it 'should find existing NormalizedText records when existing text is provided' do
        create(:concept_result_directions, text: metadata[:directions])
        expect { ConceptResult.create_from_json(json) }
          .to not_change(ConceptResultDirections, :count)
      end

      it 'should extra_metadata containing any keys not part of the normalization process' do
        extra_metadata = {'foo' => 'bar', 'baz' => 'qux'}
        metadata.merge!(extra_metadata)

        concept_result = ConceptResult.create_from_json(json)
        expect(concept_result.extra_metadata).to eq(extra_metadata)
      end

      it 'should leave extra_metadat nil if no unknown keys are provided' do
        concept_result = ConceptResult.create_from_json(json)
        expect(concept_result.extra_metadata).to be(nil)
      end
    end

    context 'self.find_or_create_from_old_concept_result' do
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
      let(:old_concept_result) { create(:sentence_combining, activity_session: activity_session, metadata: metadata) }

      it 'should create a new ConceptResult if none exists for the activity_session-attempt_number-question_number combination of the source ConceptResult' do
        expect do
          concept_result = ConceptResult.find_or_create_from_old_concept_result(old_concept_result)
          expect(concept_result.valid?).to be(true)
        end.to change(ConceptResult, :count).by(1)
      end

      it 'should return early if the old_concept_result is already in a concept_results record' do
        create(:concept_result, old_concept_result: old_concept_result)

        expect(ConceptResult).not_to receive(:create_from_json)
        ConceptResult.find_or_create_from_old_concept_result(old_concept_result)
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
          concept_result = ConceptResult.bulk_create_from_json([json, json2])
          expect(concept_result.all?(&:valid?)).to be(true)
        end.to change(ConceptResult, :count).by(2)
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
      let(:old_concept_result) { create(:sentence_combining, concept: concept, activity_session: activity_session, concept_uid: concept.uid, metadata: metadata, activity_classification_id: activity.activity_classification_id) }

      it 'should return data in the same shape as a ConceptResult' do
        concept_result = ConceptResult.find_or_create_from_old_concept_result(old_concept_result)

        expect(concept_result.legacy_format.except(:id)).to eq(old_concept_result.as_json.deep_symbolize_keys.except(:id))
      end
    end
  end

  context 'performance benchmarking', :benchmarking do
    let(:question) { create(:question) }
    let(:activity) { create(:activity, data: {questions: [{key: question.uid}]}) }
    let(:samples) { 100 }
    let!(:old_concept_results) do
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
        OldConceptResult.all.each do |cr|
          ConceptResult.find_or_create_from_old_concept_result(cr)
        end
      end
      puts format('Average ConceptResult migration runtime for %<count> items: %<runtime>.3f seconds', {runtime: (runtime / ConceptResult.count), count: ConceptResult.count})
      expect(ConceptResult.count).to eq(OldConceptResult.count)
    end
  end
end
