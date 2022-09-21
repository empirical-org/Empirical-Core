# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Demo::SessionData do
  subject { described_class.new }

  context 'activity_sessions' do
    it "should load an array of ActivitySessions" do
      expect(subject.activity_sessions.count).to eq 140
      expect(subject.activity_sessions.class).to eq Array
      expect(subject.activity_sessions.first.class).to eq ActivitySession
    end
  end

  context 'concept_results' do
    it "should load an array of ConceptResults" do
      expect(subject.concept_results.count).to eq 2004
      expect(subject.concept_results.class).to eq Array
      expect(subject.concept_results.first.class).to eq ConceptResult
    end
  end

  context 'concept_result_question_types' do
    it "should load an array of ConceptResultQuestionTypes" do
      expect(subject.concept_result_question_types.count).to eq 5
      expect(subject.concept_result_question_types.class).to eq Array
      expect(subject.concept_result_question_types.first.class).to eq ConceptResultQuestionType
    end
  end

  context 'concept_result_legacy_metadata' do
    it "should load a hash of integer to hash of key/values" do
      expect(subject.concept_result_legacy_metadata.count).to eq 2004
      expect(subject.concept_result_legacy_metadata.class).to eq Hash

      expect(subject.concept_result_legacy_metadata.first.first.class).to eq Integer
      expect(subject.concept_result_legacy_metadata.first.last.class).to eq Hash
      expect(subject.concept_result_legacy_metadata.first.last.symbolize_keys.keys.sort).to eq([:answer, :correct, :index, :prompt, :questionNumber, :unchanged])
    end
  end
end
