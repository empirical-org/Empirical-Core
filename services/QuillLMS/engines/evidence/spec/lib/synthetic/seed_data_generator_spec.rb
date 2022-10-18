# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Synthetic::SeedDataGenerator, type: :model) do
    let(:passage) { '<p>one two <strong>three four five six</p>' }
    let(:passage_clean) { 'one two three four five six' }
    let(:stem) { 'Adding esports could benefit the Olympics, but'}
    let(:conjunction) {'but'}
    let(:nouns) { ['noun1']}
    let(:full_passage_prompt) {"#{passage_clean}. Adding esports could benefit the Olympics, but"}
    let(:full_passage_prompt_alternate1) {"#{passage_clean}. Adding esports could benefit the Olympics, but the counter argument is that"}
    let(:full_passage_prompt_alternate2) {"#{passage_clean}. Even though Adding esports could benefit the Olympics,"}

    let(:full_passage_response) {['one response']}
    let(:full_passage_response2) {['one response 2']}
    let(:full_passage_alternate1_response1) {['one response 3']}
    let(:full_passage_alternate1_response2) {['one response 4']}
    let(:full_passage_alternate2_response1) {['one response 5']}
    let(:full_passage_alternate2_response2) {['one response 6']}


    let(:full_noun_prompt) {"#{passage_clean}. #{stem} #{nouns.first}"}
    let(:full_noun_response) {['two response']}

    let(:chunk1_prompt) {"one two three four. Adding esports could benefit the Olympics, but"}
    let(:chunk1_prompt_alternate1) {"one two three four. Adding esports could benefit the Olympics, but the counter argument is that"}
    let(:chunk1_prompt_alternate2) {"one two three four. Even though Adding esports could benefit the Olympics,"}
    let(:chunk1_response) {['three response']}

    let(:chunk2_prompt) {"five six. Adding esports could benefit the Olympics, but"}
    let(:chunk2_prompt_alternate1) {"five six. Adding esports could benefit the Olympics, but the counter argument is that"}
    let(:chunk2_prompt_alternate2) {"five six. Even though Adding esports could benefit the Olympics,"}
    let(:chunk2_response) {['four response']}
    let(:seed_labels) do
      [
        "full_passage_temp1_but",
        "full_passage_temp1_but the counter argument is that",
        "full_passage_temp1_Even though %{stem}",
        "full_passage_temp0.9_but",
        "full_passage_temp0.9_but the counter argument is that",
        "full_passage_temp0.9_Even though %{stem}",
        "full_passage_noun_noun1",
        "text_chunk_1_temp0.4_but",
        "text_chunk_2_temp0.4_but"
      ]
    end

    subject { described_class.new(passage: passage, stem: stem, nouns: nouns, conjunction: conjunction)}

    before do
      stub_const("Evidence::Synthetic::SeedDataGenerator::WORD_SPLIT_COUNT", 4)
      stub_const("Evidence::Synthetic::SeedDataGenerator::FULL_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::FULL_NOUN_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::SECTION_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::TEMPS_PASSAGE", [1,0.9])
    end

    describe "#new" do
      it "should initialize and clean" do
        expect(subject.passage).to eq(passage_clean)
        expect(subject.stem).to eq(stem)
        expect(subject.nouns).to eq(nouns)
        expect(subject.conjunction).to eq(conjunction)
        expect(subject.results).to eq([])
      end

      let(:passage_dirty) {' <p><strong>&quot;It&#x27;s</strong> a good day&quot;, he said.</p>  '}
      let(:data_dirty) { described_class.new(passage: passage_dirty, stem: stem, nouns: nouns, conjunction: conjunction)}

      it "should clean passage of all special characters" do
        expect(data_dirty.passage).to eq("\"It's a good day\", he said.")
      end
    end

    describe "#run" do
      it "should hit open AI for each item and store results" do
        # full - original
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 1)
          .and_return(full_passage_response)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 0.9)
          .and_return(full_passage_response2)
         # full - alternate stem1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate1, count: 1, temperature: 1)
          .and_return(full_passage_alternate1_response1)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate1, count: 1, temperature: 0.9)
          .and_return(full_passage_alternate1_response2)
        # full - alternate stem2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate2, count: 1, temperature: 1)
          .and_return(full_passage_alternate2_response1)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate2, count: 1, temperature: 0.9)
          .and_return(full_passage_alternate2_response2)
        # noun
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_noun_prompt, count: 1, temperature: 1)
          .and_return(full_noun_response)
        # chunk1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt, count: 1, temperature: 0.4)
          .and_return(chunk1_response)
        # chunk1 - alternate1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt_alternate1, count: 1, temperature: 0.4)
          .and_return(chunk1_response)
        # chunk1 - alternate2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt_alternate2, count: 1, temperature: 0.4)
          .and_return(chunk1_response)
        # chunk2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt, count: 1, temperature: 0.4)
          .and_return(chunk2_response)
        # chunk2 - alternate1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt_alternate1, count: 1, temperature: 0.4)
          .and_return(chunk2_response)
        # chunk2 - alternate2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt_alternate2, count: 1, temperature: 0.4)
          .and_return(chunk2_response)

        subject.run

        expect(subject.results.count).to be(9)
        expect(subject.results.map(&:seed)).to eq(seed_labels)
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
        output = described_class.csvs_for_activity(activity_id: activity.id, nouns: ['hello'])

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
