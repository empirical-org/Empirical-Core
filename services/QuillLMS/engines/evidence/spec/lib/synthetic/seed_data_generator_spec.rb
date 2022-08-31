# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Synthetic::SeedDataGenerator, type: :model) do
    let(:passage) { '<p>one two <strong>three four five six</p>' }
    let(:passage_clean) { 'one two three four five six' }
    let(:stem) { 'This is because'}
    let(:nouns) { ['noun1']}
    let(:full_passage_prompt) {"#{passage_clean}. #{stem} "}
    let(:full_passage_response) {['one response']}
    let(:full_passage_response2) {['one response 2']}
    let(:full_noun_prompt) {"#{passage_clean}. #{stem} #{nouns.first} "}
    let(:full_noun_response) {['two response']}

    let(:chunk1_prompt) {"one two three four. #{stem} "}
    let(:chunk1_response) {['three response']}

    let(:chunk2_prompt) {"five six. #{stem} "}
    let(:chunk2_response) {['four response']}
    let(:seed_labels) {['full_passage_temp1','full_passage_temp0.9', 'full_passage_noun_noun1', 'text_chunk_1', 'text_chunk_2']}

    let(:data) { Evidence::Synthetic::SeedDataGenerator.new(passage: passage, stem: stem, nouns: nouns)}

    before do
      stub_const("Evidence::Synthetic::SeedDataGenerator::WORD_SPLIT_COUNT", 4)
      stub_const("Evidence::Synthetic::SeedDataGenerator::FULL_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::FULL_NOUN_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::SECTION_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::TEMPS_PASSAGE", [1,0.9])
    end

    describe "#new" do
      it "should initialize and clean" do
        expect(data.passage).to eq(passage_clean)
        expect(data.stem).to eq(stem)
        expect(data.nouns).to eq(nouns)
        expect(data.results).to eq([])
      end

      let(:passage_dirty) {' <p><strong>&quot;It&#x27;s</strong> a good day&quot;, he said.</p>  '}
      let(:data_dirty) { Evidence::Synthetic::SeedDataGenerator.new(passage: passage_dirty, stem: stem, nouns: nouns)}

      it "should clean passage of all special characters" do
        expect(data_dirty.passage).to eq("\"It's a good day\", he said.")
      end
    end

    describe "#run" do
      it "should hit open AI for each item and store results" do
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 1)
          .and_return(full_passage_response)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 0.9)
          .and_return(full_passage_response2)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_noun_prompt, count: 1, temperature: 1)
          .and_return(full_noun_response)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt, count: 1, temperature: 0.5)
          .and_return(chunk1_response)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt, count: 1, temperature: 0.5)
          .and_return(chunk2_response)

        data.run

        expect(data.results.count).to be(5)
        expect(data.results.map(&:seed)).to eq(seed_labels)
      end
    end

    describe "#self.csvs_for_activity" do
      let!(:activity) { create(:evidence_activity, title: 'Some Activity Name')}
      let!(:passage) { create(:evidence_passage, activity: activity) }
      let!(:prompt) { create(:evidence_prompt, activity: activity, conjunction: "because") }

      before do
        allow(Evidence::OpenAI::Completion).to receive(:run).and_return(full_passage_response)
      end

      it "should generate a hash" do
        output = Evidence::Synthetic::SeedDataGenerator.csvs_for_activity(activity_id: activity.id, nouns: ['hello'])

        expect(output.class).to be Hash
        expect(output.keys).to eq(['Some_Activity_Name_because.csv', 'Some_Activity_Name_passage_chunks.csv'])

        # values should be a multi-line valid CSV
        csv = CSV.parse(output.values.first)
        expect(csv.size).to be 3
        expect(csv.first).to eq(["Text", "Seed"])
      end
    end
  end
end
