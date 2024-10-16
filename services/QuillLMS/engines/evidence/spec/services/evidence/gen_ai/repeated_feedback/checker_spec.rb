# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::GenAI::RepeatedFeedback::Checker, type: :service do
  let(:feedback) { 'Sample feedback text' }
  let(:history) { ['Previous feedback 1', 'Previous feedback 2'] }
  let(:optimal) { false }
  let(:llm_response) { { 'repeat_feedback' => true } }
  let(:system_prompt) { 'Generated system prompt' }

  let(:checker) { described_class.new(feedback: feedback, history: history, optimal: optimal) }

  subject { checker }

  before do
    allow(Evidence::GenAI::RepeatedFeedback::PromptBuilder).to receive(:run).and_return(system_prompt)
    allow(Evidence::OpenAI::Chat).to receive(:run).and_return(llm_response)
  end

  describe '#initialize' do
    it 'initializes with feedback, history, and optimal' do
      expect(subject.feedback).to eq(feedback)
      expect(subject.history).to eq(history)
      expect(subject.optimal).to eq(optimal)
    end
  end

  describe '#run' do
    subject { checker.run }

    context 'when optimal is true' do
      let(:optimal) { true }

      it 'returns false and doesnt hit LLM' do
        expect(Evidence::OpenAI::Chat).not_to receive(:run)
        expect(subject).to eq(false)
      end
    end

    context 'when history is empty' do
      let(:history) { [] }

      it 'returns false and doesnt hit LLM' do
        expect(Evidence::OpenAI::Chat).not_to receive(:run)
        expect(subject).to eq(false)
      end
    end

    context 'when history size is 4 or more' do
      let(:history) { ['Feedback 1', 'Feedback 2', 'Feedback 3', 'Feedback 4'] }

      it 'returns false and doesnt hit LLM' do
        expect(Evidence::OpenAI::Chat).not_to receive(:run)
        expect(subject).to eq(false)
      end
    end

    context 'when repeat_feedback key is present in llm_response' do
      let(:llm_response) { { 'repeat_feedback' => true } }

      it 'returns true' do
        expect(subject).to eq(true)
      end
    end

    context 'when repeat_feedback key is not present in llm_response' do
      let(:llm_response) { { 'repeat_feedback' => false } }

      it 'returns false' do
        expect(subject).to eq(false)
      end
    end
  end

  describe 'private methods' do
    describe '#system_prompt' do
      it 'returns the system prompt generated by RepeatedFeedback::PromptBuilder' do
        expect(subject.send(:system_prompt)).to eq(system_prompt)
      end
    end

    describe '#llm_response' do
      it 'calls Evidence::OpenAI::Chat.run with the correct parameters' do
        expect(Evidence::OpenAI::Chat).to receive(:run).with(system_prompt: system_prompt, entry: feedback, model: Evidence::OpenAI::Chat::SMALL_MODEL, temperature: 0).and_return(llm_response)
        subject.send(:llm_response)
      end
    end
  end
end
