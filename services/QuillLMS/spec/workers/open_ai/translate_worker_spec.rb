# frozen_string_literal: true

require 'rails_helper'

describe OpenAI::TranslateWorker, type: :worker do
  let(:worker) { described_class.new }

  context 'Activity' do
    let(:activity) { create(:activity) }

    subject { worker.perform(activity.id, 'Activity') }

    it 'should call translate on the activity' do
      allow(Activity).to receive(:find_by).with(id: activity.id).and_return(activity)
      expect(activity).to receive(:translate!)
      subject
    end
  end

  context 'Question' do
    let(:question) { create(:question) }

    subject { worker.perform(question.id, 'Question') }

    it 'should call translate on the question' do
      allow(Question).to receive(:find_by).with(id: question.id).and_return(question)
      expect(question).to receive(:translate!)
      subject
    end
  end

  context 'ConceptFeedback' do
    let(:concept_feedback) { create(:concept_feedback) }

    subject { worker.perform(concept_feedback.id, 'ConceptFeedback') }

    it 'should call translate on the concept_feedback' do
      allow(ConceptFeedback).to receive(:find_by).with(id: concept_feedback.id).and_return(concept_feedback)
      expect(concept_feedback).to receive(:translate!)
      subject
    end
  end

  context 'translatable not found' do
    subject { worker.perform(1298, 'Activity') }

    it { expect { subject }.not_to raise_error }
  end
end
