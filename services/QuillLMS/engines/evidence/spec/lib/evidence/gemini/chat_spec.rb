# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Evidence::Gemini::Chat, type: :service do
  let(:system_prompt) { 'You are a helpful assistant.' }
  let(:entry) { 'What is the capital of France?' }
  let(:history) { [Evidence::GenAI::HistoryItem.new(user: 'Tell me a joke.', assistant: 'Why did the chicken cross the road?')] }
  let(:temperature) { 0.7 }
  let(:model) { 'gemini-1.5-flash-latest' }
  let(:json_response) { '{"answer" : "The capital of France is Paris."}' }
  let(:body) do
    {
      'candidates' => [
        {
          'content' => {
            'parts' => [
              { 'text' => json_response }
            ]
          }
        }
      ]
    }.to_json
  end
  let(:headers) { { content_type: 'application/json' } }

  subject { described_class.new(system_prompt: system_prompt, entry: entry, history: history, temperature: temperature, model: model) }

  before do
    stub_request(:post, "#{Evidence::Gemini::BASE_URI}/#{model}:generateContent?key=").to_return(body: body, headers: headers)
  end

  describe '#initialize' do
    it 'initializes with system_prompt, entry, history, temperature, and model' do
      expect(subject.system_prompt).to eq(system_prompt)
      expect(subject.entry).to eq(entry)
      expect(subject.history).to eq(history)
      expect(subject.temperature).to eq(temperature)
      expect(subject.model).to eq(model)
    end

    it 'uses default values when not provided' do
      chat = described_class.new(system_prompt: system_prompt, entry: entry)
      expect(chat.history).to eq([])
      expect(chat.temperature).to eq(1)
      expect(chat.model).to eq(described_class::DEFAULT_MODEL)
    end
  end

  describe '#cleaned_results' do
    context 'when response is successful' do
      before { subject.run }

      it 'returns parsed JSON from the response' do
        expect(subject.cleaned_results).to eq(JSON.parse(json_response))
      end
    end

    context 'when response is nil (un-run request)' do
      it 'returns nil' do
        expect(subject.cleaned_results).to be_nil
      end
    end
  end

  describe '#body' do
    it 'returns the request body as JSON' do
      expect(subject.body).to be_a(String)
      expect { JSON.parse(subject.body) }.not_to raise_error
    end
  end

  describe '#request_body' do
    let(:expected_body) do
      {
        system_instruction: { 'parts' => { 'text' => system_prompt } },
        contents: [
          { 'role' => 'user', 'parts' => [{ 'text' => history.first.user }] },
          { 'role' => 'model', 'parts' => [{ 'text' => history.first.assistant }] },
          { 'role' => 'user', 'parts' => [{ 'text' => entry }] }
        ],
        generationConfig: { temperature: temperature, responseMimeType: 'application/json' },
        safety_settings: Evidence::Gemini::Concerns::Api::SAFETY_SETTINGS
      }
    end

    it 'returns the correct request body structure' do
      expect(subject.request_body).to eq(expected_body)
    end
  end

  describe 'private methods' do
    describe '#system_instruction' do
      it 'returns the correct system instruction format' do
        expect(subject.send(:system_instruction)).to eq({ 'parts' => { 'text' => system_prompt } })
      end
    end

    describe '#contents' do
      it 'returns the correct contents array' do
        expect(subject.send(:contents).length).to eq(3)
        expect(subject.send(:contents).last).to eq(subject.send(:current_message))
      end
    end

    describe '#current_message' do
      it 'returns the correct current message format' do
        expect(subject.send(:current_message)).to eq({ 'role' => 'user', 'parts' => [{ 'text' => entry }] })
      end
    end

    describe '#history_messages' do
      it 'returns the correct history messages format' do
        expected = [
          { 'role' => 'user', 'parts' => [{ 'text' => history.first.user }] },
          { 'role' => 'model', 'parts' => [{ 'text' => history.first.assistant }] }
        ]
        expect(subject.send(:history_messages)).to eq(expected)
      end
    end

    describe '#generation_config' do
      it 'returns the correct generation config' do
        expect(subject.send(:generation_config)).to eq({ temperature: temperature, responseMimeType: 'application/json' })
      end
    end

    describe '#model_version' do
      it 'returns the correct model version' do
        expect(subject.send(:model_version)).to eq(model)
      end
    end

    describe '#instruction' do
      it 'returns the correct instruction' do
        expect(subject.send(:instruction)).to eq('generateContent')
      end
    end
  end
end
