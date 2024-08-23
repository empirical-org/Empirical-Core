# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EvidenceUpdateScoringWorker do
  subject { described_class.new.perform(activity_session_id) }

  let(:attempts) { 1..5 }
  let(:final_correct) { true }
  let(:question_score) { 0.5 }
  let(:activity_session) { create(:activity_session) }
  let(:activity_session_id) { activity_session.id }
  let(:base_concept_results) do
    attempts.map do |attempt_number|
      create(:concept_result,
        activity_session:,
        attempt_number:,
        question_score:,
        correct: attempt_number == attempts.last ? final_correct : false)
    end
  end
  let(:concept_results) { base_concept_results }
  let(:final_attempt) { concept_results.last }

  before do
    allow(ConceptResult).to receive(:where).with(activity_session_id:).and_return(concept_results)
  end

  describe '#perform' do
    it { expect { subject }.to change(final_attempt, :question_score).from(question_score).to(1.0) }

    context 'no concept_results found' do
      let(:concept_results) { [] }

      it do
        expect(concept_results).not_to receive(:group_by)
        subject
      end
    end

    context 'old concept_results are unscored' do
      let(:question_score) { nil }

      it do
        expect(concept_results).not_to receive(:group_by)
        subject
      end
    end

    context 'fewer than 5 attempts' do
      let(:attempts) { 1..4 }

      it { expect { subject }.to change(final_attempt, :question_score).from(question_score).to(1.0) }
    end

    context 'fifth attempt incorrect' do
      let(:final_correct) { false }

      it { expect { subject }.to change(final_attempt, :question_score).from(question_score).to(0) }
    end

    context 'fifth attempt both correct and incorrect' do
      let!(:concept_result) do
        base_concept_results.push(create(:concept_result,
          activity_session:,
          question_score:,
          correct: !final_correct,
          attempt_number: attempts.last))
      end

      it { expect { subject }.to change(final_attempt, :question_score).from(question_score).to(0) }
    end
  end
end
