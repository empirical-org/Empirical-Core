# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Synthetic::SeedDataGenerator, type: :model) do
    let(:passage_text) { '<p>one two <strong>three four five six seven eight</p>' }
    let(:passage_clean) { 'one two three four five six seven eight' }
    let(:stem) { 'Intro, but'}
    let(:conjunction) {'but'}
    let(:nouns) { ['noun1']}
    let(:full_passage_prompt) {"#{passage_clean}. #{stem}"}
    let(:full_passage_prompt_alternate1) {"#{passage_clean}. Intro, but the counter argument is that"}
    let(:full_passage_prompt_alternate2) {"#{passage_clean}. Even though Intro,"}

    let(:full_passage_response) {['one response']}
    let(:full_passage_response2) {['one response 2']}
    let(:full_passage_alternate1_response1) {['one response 3']}
    let(:full_passage_alternate1_response2) {['one response 4']}
    let(:full_passage_alternate2_response1) {['one response 5']}
    let(:full_passage_alternate2_response2) {['one response 6']}

    let(:full_noun_prompt) {"#{passage_clean}. #{stem} #{nouns.first}"}
    let(:full_noun_response) {['two response']}

    let(:chunk1_prompt) {"one two three four. #{stem}"}
    let(:chunk1_prompt_alternate1) {"one two three four. Intro, but the counter argument is that"}
    let(:chunk1_prompt_alternate2) {"one two three four. Even though Intro,"}
    let(:chunk1_response) {['three response']}

    let(:chunk2_prompt) {"five six seven eight. Intro, but"}
    let(:chunk2_prompt_alternate1) {"five six seven eight. Intro, but the counter argument is that"}
    let(:chunk2_prompt_alternate2) {"five six seven eight. Even though Intro,"}
    let(:chunk2_response) {['four response']}

    let(:example) {'Example to paraphrase.'}
    let(:label) { 'label1' }
    let(:label_config) {{'label' => label, 'examples' => [example]}}
    let(:example_prompt) { "rephrase with some synonyms:\n\nExample to paraphrase." }
    let(:example_response) { ["Example to rephrase."] }

    let(:label_tag) { "label_example_label1_1_temp_1" }

    let(:seed_labels) do
      [
        "full_passage_temp_1_but",
        "full_passage_temp_1_but the counter argument is that",
        "full_passage_temp_1_even though %<stem>s",
        "full_passage_temp_0.9_but",
        "full_passage_temp_0.9_but the counter argument is that",
        "full_passage_temp_0.9_even though %<stem>s",
        "full_passage_noun_temp_0.8_noun1",
        "passage_chunk_1_temp_0.4_but",
        "passage_chunk_2_temp_0.4_but",
        label_tag
      ]
    end

    let(:activity) { create(:evidence_activity) }
    let!(:passage) { create(:evidence_passage, text: passage_text, activity: activity)}
    let(:prompt) { create(:evidence_prompt, activity: activity, text: stem, conjunction: conjunction)}
    let(:batch) { create(:seed_prompt_text_batch, prompt: prompt, use_passage: true, nouns: nouns, label_configs: [label_config])}

    subject { described_class.new(batch)}

    before do
      stub_const("Evidence::Synthetic::SeedDataGenerator::WORD_SPLIT_COUNT", 4)
      stub_const("Evidence::Synthetic::SeedDataGenerator::FULL_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::FULL_NOUN_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::SECTION_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::EXAMPLE_COUNT", 1)
      stub_const("Evidence::Synthetic::SeedDataGenerator::TEMPS_PASSAGE", [1,0.9])
      allow(::Evidence::Check::Opinion).to receive(:run).and_return(double(success?: true, optimal?: true))
    end

    describe "#new" do
      it "should initialize and clean" do
        expect(subject.passage).to eq(passage_clean)
        expect(subject.stem).to eq(stem)
        expect(subject.nouns).to eq(nouns)
        expect(subject.conjunction).to eq(conjunction)
        expect(subject.results).to eq([])
      end
    end

    describe "#run" do
      it "should hit open AI for each item and store results" do
        # full - original
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 1, options: {})
          .and_return(full_passage_response)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt, count: 1, temperature: 0.9, options: {})
          .and_return(full_passage_response2)
        # full - alternate stem1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate1, count: 1, temperature: 1, options: {})
          .and_return(full_passage_alternate1_response1)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate1, count: 1, temperature: 0.9, options: {})
          .and_return(full_passage_alternate1_response2)
        # full - alternate stem2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate2, count: 1, temperature: 1, options: {})
          .and_return(full_passage_alternate2_response1)
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_passage_prompt_alternate2, count: 1, temperature: 0.9, options: {})
          .and_return(full_passage_alternate2_response2)
        # noun
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: full_noun_prompt, count: 1, temperature: 0.8, options: {})
          .and_return(full_noun_response)
        # chunk1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt, count: 1, temperature: 0.4, options: {})
          .and_return(chunk1_response)
        # chunk1 - alternate1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt_alternate1, count: 1, temperature: 0.4, options: {})
          .and_return(chunk1_response)
        # chunk1 - alternate2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk1_prompt_alternate2, count: 1, temperature: 0.4, options: {})
          .and_return(chunk1_response)
        # chunk2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt, count: 1, temperature: 0.4, options: {})
          .and_return(chunk2_response)
        # chunk2 - alternate1
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt_alternate1, count: 1, temperature: 0.4, options: {})
          .and_return(chunk2_response)
        # chunk2 - alternate2
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: chunk2_prompt_alternate2, count: 1, temperature: 0.4, options: {})
          .and_return(chunk2_response)

        # label example
        expect(Evidence::OpenAI::Completion).to receive(:run)
          .with(prompt: example_prompt, count: 1, temperature: 1, options: {max_tokens: 40})
          .and_return(example_response)

        subject.run

        expect(subject.results.count).to be(10)
        expect(subject.results.map(&:seed_descriptor)).to eq(seed_labels)
        expect(subject.results.map(&:seed_label)).to eq([nil, nil, nil, nil, nil, nil, nil, nil, nil, "label1"])
      end


      context "use_passage=false" do
        let(:batch) { create(:seed_prompt_text_batch, use_passage: false, label_configs: [label_config])}

        subject { described_class.new(batch)}

        it "should generate ONLY label paraphrases" do
          # label example
          expect(Evidence::OpenAI::Completion).to receive(:run)
            .with(prompt: example_prompt, count: 1, temperature: 1, options: {max_tokens: 40})
            .and_return(example_response)

          subject.run

          expect(subject.results.count).to be(1)
          expect(subject.results.map(&:seed_descriptor)).to eq([label_tag])
          expect(subject.results.map(&:seed_label)).to eq(["label1"])
        end
      end
    end

    describe "#run_generator" do
      let(:rejected_response) {['one response']}
      let(:conjunction) {'because'}
      let(:because) {described_class.new(batch)}
      let(:generator) { Evidence::TextGeneration.new(ml_prompt: '', count: 1, temperature: 1) }

      before do
        allow(Evidence::OpenAI::Completion).to receive(:run).and_return(response)
      end

      subject { because.send(:run_generator, generator) }

      context 'response in exclude regex' do
        let(:response) {['of getting excluded']}

        it "should reject response" do
          expect(subject.count).to eq 0
        end
      end

      context 'response not in exclude regex' do
        let(:response) {['it would not be excluded']}

        it "should not reject response" do
          expect(subject.count).to eq 1
        end
      end

      context 'lowercasing responses' do
        let(:passage_text) { 'Juliet calls out to Romeo and says yo, how are you?' }
        let(:response) {['They is a common word', 'Romeo dies (spoiler)', 'Calls out to him', 'lowercase']}
        let(:because) {described_class.new(batch)}

        it "should downcase first letter if common word or lowercase in passage" do
          expect(subject.first.text).to eq 'they is a common word'
          expect(subject.second.text).to eq 'Romeo dies (spoiler)'
          expect(subject.third.text).to eq 'calls out to him'
          expect(subject.fourth.text).to eq 'lowercase'
        end
      end

      context 'opinion check' do
        before do
          allow(::Evidence::Check::Opinion).to receive(:run).and_return(opinion_response)
        end

        let(:response) {['some text']}

        context 'flagged as opinion' do
          let(:opinion_response) { double(success?: true, optimal?: false) }

          it "should reject response" do
            expect(subject.count).to eq 0
          end
        end

        context 'api failure' do
          let(:opinion_response) { double(success?: false, optimal?: false) }

          it "should NOT reject response" do
            expect(subject.count).to eq 1
          end
        end

        context 'non-opinion' do
          let(:opinion_response) { double(success?: true, optimal?: true) }

          it "should NOT reject response" do
            expect(subject.count).to eq 1
          end
        end
      end
    end

    describe 'API timeout' do
      let(:openai_url) {'https://api.openai.com/v1/completions'}
      let(:because) {described_class.new(batch)}
      let(:generator) { Evidence::TextGeneration.new(ml_prompt: '', count: 1, temperature: 1) }

      before do
        stub_request(:post, openai_url).to_timeout
      end

      context 'run_generator' do
        subject { because.send(:run_generator, generator) }

        it "return empty array" do
          expect(subject).to eq([])
        end
      end
    end

    describe "#stem_variants_hash" do
      let(:conjunction) {'so'}
      let(:stem) {"It is true, #{conjunction}"}
      let(:subs) {['therefore', 'Since %<stem>s this is']}
      let(:conjunction_config) { {conjunction => subs}}

      before do
        stub_const("Evidence::Synthetic::SeedDataGenerator::CONJUNCTION_SUBS", conjunction_config)
        stub_const("Evidence::Synthetic::SeedDataGenerator::CONJUNCTIONS", [conjunction])
      end

      subject {described_class.new(batch).send(:stem_variants_hash)}

      it "should return hash of conjunctions => stems" do
        expect(subject.keys).to eq([conjunction] + subs)
        expect(subject[conjunction]).to eq stem
        expect(subject['therefore']).to eq "It is true, therefore"
        expect(subject['Since %<stem>s this is']).to eq "Since It is true, this is"
      end
    end

    describe "#regex_exclude?" do
      let(:prompt_so) { create(:evidence_prompt, conjunction: 'so')}
      let(:prompt_because) { create(:evidence_prompt, conjunction: 'because')}
      let(:batch_so) { create(:seed_prompt_text_batch, prompt: prompt_so)}
      let(:batch_because) { create(:seed_prompt_text_batch, prompt: prompt_because)}

      let(:because) {described_class.new(batch_because)}
      let(:so) {described_class.new(batch_so)}
      let(:but) {described_class.new(batch)}

      it "should be true for matching regex" do
        expect(because.send(:regex_exclude?, "of the reason")).to be true
        expect(because.send(:regex_exclude?, "  of the reason")).to be true
        expect(so.send(:regex_exclude?, "that happened")).to be true
      end

      it "should be false for non-matching regex" do
        expect(but.send(:regex_exclude?, "of the reason")).to be false
        expect(but.send(:regex_exclude?, "that happened")).to be false
        expect(because.send(:regex_exclude?, "the reason of")).to be false
        expect(because.send(:regex_exclude?, "that happened")).to be false
        expect(so.send(:regex_exclude?, "happened like that")).to be false
        expect(so.send(:regex_exclude?, "of the reason")).to be false
      end

    end

    describe "#self.csvs_for_activity" do
      let!(:activity) { create(:evidence_activity, title: 'Some Activity Name')}
      let!(:passage) { create(:evidence_passage, activity: activity) }
      let!(:prompt) { create(:evidence_prompt, activity: activity, conjunction: "because") }

      before do
        allow(Evidence::OpenAI::Completion).to receive(:run).and_return(full_passage_response)
      end

      subject { described_class.csvs_for_activity(activity_id: activity.id, nouns: ['hello']) }

      it "should generate a hash" do
        expect(subject.class).to be Hash
        expect(subject.keys).to eq(['Some_Activity_Name_because.csv'])

        # values should be a multi-line valid CSV
        csv = CSV.parse(subject.values.first)
        expect(csv.size).to be 3
        expect(csv.first).to eq(["Text", "Seed", "Initial Label"])
      end

      context "label examples only" do
        subject { described_class.csvs_for_activity(activity_id: activity.id, label_configs: [label_config], use_passage: false) }

        it "should generate a hash without prompt_chunks csv" do
          expect(subject.class).to be Hash
          expect(subject.keys).to eq(['Some_Activity_Name_because.csv'])

          # values should be a multi-line valid CSV
          csv = CSV.parse(subject.values.first)
          expect(csv.size).to be 2
          expect(csv.first).to eq(["Text", "Seed", "Initial Label"])
        end
      end
    end
  end
end
