# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::Generators::Paraphrase do
  let(:text1) {'text string'}
  let(:passage) {"passage text text text text text"}
  let(:result1) {'word string'}
  let(:result2) {'sentence string'}
  let(:uppercase_result) {'Text yarn'}

  let(:api_results) {[result1, result2]}
  let(:api_result_with_uppercase) {[uppercase_result]}
  let(:prompt) {"rephrase with some synonyms:\n\n#{text1}"}

  let(:paraphrase_response) do
    {
      text1 => {'0' => result1, '1' => result2}
    }
  end

  let(:paraphrase_uppercase_response) do
    {
      text1 => {'0' => uppercase_result.downcase}
    }
  end

  describe '#generate' do
    subject { described_class.new([text1], passage: passage).run}

    it 'should return paraphrases in hash format' do
      expect(Evidence::OpenAI::Completion).to receive(:run)
        .with(prompt: prompt, count: 4, temperature: 0.7)
        .and_return(api_results)

      generator_results = subject[text1].first
      generator = generator_results.generator

      expect(generator.type).to eq 'Paraphrase'
      expect(generator.count).to eq(4)
      expect(generator.temperature).to eq(0.7)
      expect(generator_results.results).to eq(api_results)
    end

    it 'should lowercase result when applicable' do
      expect(Evidence::OpenAI::Completion).to receive(:run)
        .with(prompt: prompt, count: 4, temperature: 0.7)
        .and_return(api_result_with_uppercase)

      generator_results = subject[text1].first
      generator = generator_results.generator

      expect(generator.type).to eq 'Paraphrase'
      expect(generator.count).to eq(4)
      expect(generator.temperature).to eq(0.7)
      expect(generator_results.results).to eq([uppercase_result.downcase])
    end
  end
end
