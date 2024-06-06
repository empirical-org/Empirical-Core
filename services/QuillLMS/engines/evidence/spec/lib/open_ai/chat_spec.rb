# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::OpenAI::Chat, type: :service do
  let(:system_prompt) { 'You are a helpful assistant.' }
  let(:entry) { 'What is the capital of France?' }
  let(:history) { [described_class::HistoryItem.new(user: 'Tell me a joke.', assistant: 'Why did the chicken cross the road?')] }
  let(:temperature) { 0.7 }
  let(:json_response) { '{"answer" : "The capital of France is Paris."}' }
  let(:body) { { 'choices' => [{ 'message' => { 'content' => json_response } }] }.to_json }
  let(:headers) { { content_type: 'application/json' } }

  subject { described_class.new(system_prompt: system_prompt, entry: entry, history: history, temperature: temperature) }

  before do
    stub_request(:post, "https://api.openai.com/v1/chat/completions").to_return(body:, headers:)
  end

  describe '#initialize' do
    it 'initializes with system_prompt, entry, history, and temperature' do
      expect(subject.system_prompt).to eq(system_prompt)
      expect(subject.entry).to eq(entry)
      expect(subject.history).to eq(history)
      expect(subject.temperature).to eq(temperature)
    end
  end

  describe '#run' do
    let!(:result) {subject.run}
    it 'returns cleaned results' do
      expect(result['answer']).to eq('The capital of France is Paris.')
    end

    it 'caches the response' do
      expect(subject.cleaned_results).to eq(JSON.parse(json_response))
    end
  end

  describe '#endpoint' do
    it 'returns the correct endpoint' do
      expect(subject.endpoint).to eq('/chat/completions')
    end
  end

  describe '#request_body' do
    it 'returns the correct request body' do
      expected_body = {
        model: 'gpt-4-turbo',
        temperature: temperature,
        messages: [
          { 'role' => 'system', 'content' => system_prompt },
          { 'role' => 'user', 'content' => history.first.user },
          { 'role' => 'assistant', 'content' => history.first.assistant },
          { 'role' => 'user', 'content' => entry }
        ],
        n: 1,
        response_format: { 'type' => 'json_object' }
      }
      expect(subject.request_body).to eq(expected_body)
    end
  end

  describe 'private methods' do
    describe '#messages' do
      it 'returns the correct message array' do
        expected_messages = [
          { 'role' => 'system', 'content' => system_prompt },
          { 'role' => 'user', 'content' => history.first.user },
          { 'role' => 'assistant', 'content' => history.first.assistant },
          { 'role' => 'user', 'content' => entry }
        ]
        expect(subject.send(:messages)).to eq(expected_messages)
      end
    end

    describe '#system_message' do
      it 'returns the correct system message' do
        expect(subject.send(:system_message)).to eq({ 'role' => 'system', 'content' => system_prompt })
      end
    end

    describe '#current_message' do
      it 'returns the correct current message' do
        expect(subject.send(:current_message)).to eq({ 'role' => 'user', 'content' => entry })
      end
    end

    describe '#history_messages' do
      it 'returns the correct history messages' do
        expected_history_messages = [
          { 'role' => 'user', 'content' => history.first.user },
          { 'role' => 'assistant', 'content' => history.first.assistant }
        ]
        expect(subject.send(:history_messages)).to eq(expected_history_messages)
      end
    end

    describe '#cleaned_results' do
      before { subject.run }

      it 'returns the cleaned results from the response' do
        expect(subject.cleaned_results['answer']).to eq('The capital of France is Paris.')
      end
    end

    describe '#result_json_string' do
      before { subject.run }

      it 'returns the result json string from the response' do
        expect(subject.send(:result_json_string)).to eq(json_response)
      end
    end
  end
end
