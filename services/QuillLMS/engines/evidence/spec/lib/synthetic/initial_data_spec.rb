# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Synthetic::InitialData, type: :model) do
    let(:passage) { 'one two three four five six' }
    let(:stem) { 'This is because'}
    let(:nouns) { ['noun1']}
    let(:full_passage_prompt) {passage + '. ' + stem + ' '}
    let(:full_passage_response) {['one response']}
    let(:full_noun_prompt) {passage + '. ' + stem + ' ' + nouns.first + ' '}
    let(:full_noun_response) {['two response']}

    let(:chunk1_prompt) {'one two three four' + '. ' + stem + ' '}
    let(:chunk1_response) {['three response']}

    let(:chunk2_prompt) {'five six' + '. ' + stem + ' '}
    let(:chunk2_response) {['four response']}
    let(:seed_labels) {['full_passage', 'full_passage_noun_noun1', 'text_chunk_1', 'text_chunk_2']}


    let(:data) { Evidence::Synthetic::InitialData.new(passage: passage, stem: stem, nouns: nouns)}

    describe "#new" do
      it "should initialize as expected" do
        expect(data.passage).to eq(passage)
        expect(data.stem).to eq(stem)
        expect(data.nouns).to eq(nouns)
        expect(data.results).to eq([])
      end
    end

    describe "#run" do
      before do
        stub_const("Evidence::Synthetic::InitialData::WORD_SPLIT_COUNT", 4)
        stub_const("Evidence::Synthetic::InitialData::FULL_COUNT", 1)
        stub_const("Evidence::Synthetic::InitialData::FULL_NOUN_COUNT", 1)
        stub_const("Evidence::Synthetic::InitialData::SECTION_COUNT", 1)
      end

      it "should hit open AI for each item and store results" do
        expect(Evidence::OpenAI).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 1)
          .and_return(full_passage_response)
        expect(Evidence::OpenAI).to receive(:run)
          .with(prompt: full_noun_prompt, count: 1, temperature: 1)
          .and_return(full_noun_response)
        expect(Evidence::OpenAI).to receive(:run)
          .with(prompt: chunk1_prompt, count: 1, temperature: 0.5)
          .and_return(chunk1_response)
        expect(Evidence::OpenAI).to receive(:run)
          .with(prompt: chunk2_prompt, count: 1, temperature: 0.5)
          .and_return(chunk2_response)

        data.run

        expect(data.results.count).to be(4)
        expect(data.results.map(&:seed)).to eq(seed_labels)
      end
    end
  end
end
