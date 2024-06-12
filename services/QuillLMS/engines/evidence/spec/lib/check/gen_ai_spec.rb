# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::Check::GenAI, type: :service do
  let(:entry) { 'What is the capital of France?' }
  let(:prompt) { double('Prompt', id: 1, text: 'Tell me about the Eiffel Tower.') }
  let(:previous_feedback) { 'Previous feedback text' }
  let(:session_uid) { 'session-uid-1234' }
  let(:system_prompt) { 'You are a helpful assistant.' }
  let(:chat_response) { { 'feedback' => 'Sample feedback', 'optimal' => true, 'highlight' => '1' } }
  let(:response) { { 'feedback' => 'Sample feedback', 'optimal' => true } }

  subject { described_class.new(entry, prompt, previous_feedback, session_uid) }

  before do
    allow(Evidence::GenAI::SystemPromptBuilder).to receive(:run).and_return(system_prompt)
    allow(Evidence::OpenAI::Chat).to receive(:run).and_return(chat_response)
    allow(Evidence::GenAI::ResponseBuilder).to receive(:run).and_return(response)
  end

  describe '#initialize' do
    it 'initializes with entry, prompt, previous_feedback, and session_uid' do
      expect(subject.entry).to eq(entry)
      expect(subject.prompt).to eq(prompt)
      expect(subject.previous_feedback).to eq(previous_feedback)
      expect(subject.session_uid).to eq(session_uid)
    end
  end

  describe '#run' do
    it 'sets the response using the system prompt, chat response, and response builder' do
      subject.run
      expect(subject.response).to eq(response)
    end
  end

  describe '#use_for_optimal_feedback?' do
    it 'returns true' do
      expect(subject.use_for_optimal_feedback?).to eq(true)
    end
  end

  describe '#optimal?' do
    context 'when response is present' do
      before { subject.instance_variable_set(:@response, response) }

      it 'returns the optimal value from the response' do
        expect(subject.optimal?).to eq(true)
      end
    end

    context 'when response is not present' do
      before { subject.instance_variable_set(:@response, nil) }

      it 'returns true' do
        expect(subject.optimal?).to eq(true)
      end
    end
  end

  describe '#success?' do
    context 'when there is no error' do
      it 'returns true' do
        expect(subject.success?).to eq(true)
      end
    end

    context 'when there is an error' do
      before { subject.instance_variable_set(:@error, StandardError.new('An error occurred')) }

      it 'returns false' do
        expect(subject.success?).to eq(false)
      end
    end
  end

  describe 'private methods' do
    describe '#current_entry' do
      it 'returns the entry' do
        expect(subject.send(:current_entry)).to eq(entry)
      end
    end

    describe '#history' do
      let(:feedback_session_class) { double('FeedbackSessionClass') }
      let(:session) { double('Session', history_texts: feedback_history) }
      let(:feedback_history) do
        [
          double('FeedbackHistory', entry: 'History entry 1', feedback_text: 'History feedback 1', attempt: 1),
          double('FeedbackHistory', entry: 'History entry 2', feedback_text: 'History feedback 2', attempt: 2)
        ]
      end

      before do
        allow(Evidence).to receive(:feedback_session_class).and_return(feedback_session_class)
        allow(feedback_session_class).to receive(:find_by).with(activity_session_uid: session_uid).and_return(session)
      end

      it 'returns the correct history items' do
        expected_history = [
          Evidence::OpenAI::Chat::HistoryItem.new(user: 'History entry 1', assistant: 'History feedback 1'),
          Evidence::OpenAI::Chat::HistoryItem.new(user: 'History entry 2', assistant: 'History feedback 2')
        ]
        expect(subject.send(:history)).to eq(expected_history)
      end

      context 'when session is not found' do
        before do
          allow(feedback_session_class).to receive(:find_by).with(activity_session_uid: session_uid).and_return(nil)
        end

        it 'returns an empty array' do
          expect(subject.send(:history)).to eq([])
        end
      end
    end
  end
end
