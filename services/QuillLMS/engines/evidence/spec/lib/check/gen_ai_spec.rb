# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::Check::GenAI, type: :service do
  let(:entry) { 'What is the capital of France?' }
  let(:prompt) { create(:evidence_prompt, text: 'Tell me about the Eiffel Tower.') }
  let(:previous_feedback) { [{ 'feedback' => 'Previous feedback text' }] }
  let(:session_uid) { 'session-uid-1234' }
  let(:system_prompt) { 'You are a helpful assistant.' }
  let(:primary_response) { { 'feedback' => 'Sample feedback', 'optimal' => true } }
  let(:secondary_response) { { 'feedback' => 'Secondary feedback', 'optimal' => false } }
  let(:response) { { 'feedback' => 'Sample feedback', 'optimal' => true } }

  subject { described_class.new(entry, prompt, previous_feedback, session_uid) }

  before do
    allow(Evidence::GenAI::SystemPromptBuilder).to receive(:run).and_return(system_prompt)
    allow(Evidence::OpenAI::Chat).to receive(:run).and_return(primary_response, secondary_response)
    allow(Evidence::GenAI::ResponseBuilder).to receive(:run).and_return(response)
    allow(Evidence::GenAI::RepeatedFeedbackChecker).to receive(:run).and_return(false)
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
    it 'sets the response using the response builder with primary and secondary responses' do
      subject.run
      expect(subject.response).to eq(response)
    end
  end

  describe '#use_for_optimal_feedback?' do
    it 'returns true' do
      expect(subject.use_for_optimal_feedback?).to eq(true)
    end
  end

  describe 'private methods' do
    describe '#current_entry' do
      it 'returns the entry' do
        expect(subject.send(:current_entry)).to eq(entry)
      end
    end

    describe '#primary_feedback' do
      it 'returns the feedback from the primary response' do
        expect(subject.send(:primary_feedback)).to eq('Sample feedback')
      end
    end

    describe '#primary_optimal' do
      it 'returns the optimal value from the primary response' do
        expect(subject.send(:primary_optimal)).to eq(true)
      end
    end

    describe '#secondary_response' do
      context 'when repeated feedback is true' do
        before { allow(Evidence::GenAI::RepeatedFeedbackChecker).to receive(:run).and_return(true) }

        it 'calls secondary_feedback_response' do
          expect(subject.send(:secondary_response)).to eq(secondary_response)
        end
      end

      context 'when repeated feedback is false' do
        before { allow(Evidence::GenAI::RepeatedFeedbackChecker).to receive(:run).and_return(false) }

        it 'returns an empty hash' do
          expect(subject.send(:secondary_response)).to eq({})
        end
      end
    end

    describe '#feedback_history' do
      it 'returns the feedback history from previous feedback' do
        expect(subject.send(:feedback_history)).to eq(['Previous feedback text'])
      end
    end

    describe '#session_history' do
      let(:session) { double('Session', feedback_history: feedback_history) }
      let(:feedback_history) do
        [
          double('FeedbackHistory', id: 1, entry: 'History entry 1', feedback_text: 'History feedback 1'),
          double('FeedbackHistory', id: 2, entry: 'History entry 2', feedback_text: 'History feedback 2')
        ]
      end

      before do
        allow(Evidence.feedback_session_class).to receive(:find_by).with(activity_session_uid: session_uid).and_return(session)
      end

      it 'returns the correct history items' do
        expected_history = [
          Evidence::OpenAI::Chat::HistoryItem.new(user: 'History entry 1', assistant: 'History feedback 1'),
          Evidence::OpenAI::Chat::HistoryItem.new(user: 'History entry 2', assistant: 'History feedback 2')
        ]
        expect(subject.send(:session_history)).to eq(expected_history)
      end

      context 'when session is not found' do
        before do
          allow(Evidence.feedback_session_class).to receive(:find_by).with(activity_session_uid: session_uid).and_return(nil)
        end

        it 'returns an empty array' do
          expect(subject.send(:session_history)).to eq([])
        end
      end
    end
  end
end
