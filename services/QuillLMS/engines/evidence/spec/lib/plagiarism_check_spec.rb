# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(PlagiarismCheck, :type => :model) do
    let!(:rule) { create(:evidence_rule, :rule_type => "plagiarism") }

    context 'should #feedback_object' do

      it 'should return appropriate feedback attributes if there is plagiarism' do
        $redis.redis.flushdb
        entry = "these are s'',ome! r''esponse words to plagiarize and this is plagiarism"
        passage = "these are some res,,,,ponse,,,, words to plagiarize and this is plagiarism"
        feedback = "this is some standard plagiarism feedback"
        plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_falsey)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
        expect(feedback[:highlight][0][:text]).to(be_truthy)
        expect(feedback[:highlight][1][:text]).to(be_truthy)
      end

      it 'should return appropriate feedback when there is no plagiarism' do
        entry = "these are some response words to plagiarize"
        passage = "it is always bad to plagiarize"
        feedback = "this is some standard plagiarism feedback"
        optimal_rule = create(:evidence_rule, :rule_type => "plagiarism", :optimal => true)
        plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end

      it 'should not be plagiarized if the plagiarism word phrase is under the match minimum' do
        entry = "these are some response words to plagiarize"
        passage = "it is always bad to plagiarize"
        feedback = "it is always bad to plagiarize"
        optimal_rule = create(:evidence_rule, :rule_type => "plagiarism", :optimal => true)
        plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end

      it 'should highlight the first matched instance of plagiarism even if there are multiple instances' do
        entry = "This particular sentence is both plagiarized and longer than just, however this particular sentence is both plagiarized and longer than just ten words."
        passage = "This particular sentence is both plagiarized and longer than just ten words."
        feedback = "Feedback!"
        optimal_rule = create(:evidence_rule, :rule_type => "plagiarism", :optimal => true)
        plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:highlight][0][:text]).to eq("This particular sentence is both plagiarized and longer than just")
      end

      context 'space normalization handling' do
        let(:feedback) { "this is some standard plagiarism feedback" }

        it 'should successfully highlight even when the user entry has multiple consecutive spaces but the passage does not' do
          entry = "This phrase plagiarises from  the    passage even     though it  has a ton of spaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:highlight][0][:text]).to eq("from  the    passage even     though it  has a ton of spaces")
          expect(feedback[:highlight][1][:text]).to eq("From the passage even though it has a ton of spaces")
        end

        it 'should successfully highlight even when the passage has multiple consecutive spaces but the user entry does not' do
          entry = "This phrase plagiarises from the passage even though it has a ton of spaces in it."
          passage = "From the  passage even    though it has   a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:highlight][0][:text]).to eq("from the passage even though it has a ton of spaces")
          expect(feedback[:highlight][1][:text]).to eq("From the  passage even    though it has   a ton of spaces")
        end

        it 'should successfully highlight even when the user entry has isolated punctuation but the passage does not' do
          entry = "This phrase plagiarises from - the  --  passage even -  -  though it , has a ton of spaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:highlight][0][:text]).to eq("from - the  --  passage even -  -  though it , has a ton of spaces")
          expect(feedback[:highlight][1][:text]).to eq("From the passage even though it has a ton of spaces")
        end

        it 'should successfully highlight even when the passage has isolated punctuation but the user entry does not' do
          entry = "This phrase plagiarises from the passage even though it has a ton of spaces in it."
          passage = "From the - passage even - - - though it has --  a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:highlight][0][:text]).to eq("from the passage even though it has a ton of spaces")
          expect(feedback[:highlight][1][:text]).to eq("From the - passage even - - - though it has --  a ton of spaces")
        end
      end

      context 'fuzzy matching' do
        let(:feedback) { "this is some standard plagiarism feedback" }

        it 'should identify plagiarism when there is a fuzzy match of 5 or less' do
          entry = "This phrase plagiarises from the passage even though it has a ton of TYPOspaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:optimal]).to be(false)
        end

        it 'should generate valid entry and passage highlights when fuzzy matching' do
          entry = "This phrase plagiarises from the passage even though it has a ton of TYPOspaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(entry).to include(feedback[:highlight][0][:text])
          expect(passage).to include(feedback[:highlight][1][:text])
        end
      end
    end

    context 'benchmarking', :benchmarking do
      let(:plagiarism_text) { "At particular times in the year, fish travel to new locations where they lay their eggs. A surge barrier could block certain fish from getting to their spawning locations and safely releasing their eggs. A surge barrier could also slow the flow of the water, causing some eggs to sink. This could pose a problem for fish eggs that need oxygen and must stay on the surface of the water in order to survive."}

      def run_benchmark_on_entries(label, entries, plagiarized)
        runtime = Benchmark.realtime do
          entries.each do |entry|
            expect(Evidence::PlagiarismCheck.new(entry, plagiarism_text, '', rule).feedback_object[:optimal]).to eq(plagiarized)
          end
        end
        puts format('Average %<label>s runtime: %<runtime>.3f seconds', {label: label, runtime: (runtime / entries.length)})
      end

      it '#short plagiarized responses' do
        run_benchmark_on_entries('short (50-100 character) plagiarized entries', [
          "A surge barrier in New York City could harm the local ecosystem because it could block certain fish from getting to their spawning locations",
          "A surge barrier in New York City could harm the local ecosystem because it could slow the flow of the water, causing some eggs to sink.",
          "A surge barrier in New York City could harm the local ecosystem because the fish eggs need oxygen and must stay on the surface of the water.",
          "A surge barrier in New York City could harm the local ecosystem because it can block fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it could block certain fish and it could also slow the flow of the water, causing some eggs to sink.",
          "A surge barrier in New York City could harm the local ecosystem because it could block certain fish from getting to their spawning locations"
        ], false)
      end

      it '#short non-plagiarized cases' do
        run_benchmark_on_entries("short (50-100 character) non-plagiarized entries", [
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier could interupt the spawning season for many fish.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier could intterupt spawaning season for many fish.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier could keep fish away from their spawning location.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier is one of the more expensive options.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can block fish from their spawning locations.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can block fish to go to their spawning area to safely release their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can block the fish from going to their spawning locations and cause eggs to sink."
        ], true)
      end

      it '#medium plagiarism cases' do
        run_benchmark_on_entries("medium (101-150 character) plagiarized entries", [
          'A surge barrier in New York City could harm the local ecosystem because a surge barrier could "block certain fish from getting to their spawning locations" and could "slow the flow of water" causing eggs to "sink."',
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier could block certain fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because at particular times in the year fish ravel to new locations where they lay their eggs a surge barrier could also slow the flow of the water.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier could pose a problem for fish eggs that need oxygen and must stay on the surface of the water in order to survive."
        ], false)
      end

      it '#medium non-plagiarism cases' do
        run_benchmark_on_entries("medium (101-150 character) non-plagiarized entries", [
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can harm the spawning season for many fish and could block some of the fish from getting to their spawning locations safely.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can interrupt fish having babies because they can't get to their location to lay the eggs.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can interrupt the fish spawning by cutting causing some eggs to sink and lose oxygen, which harms the ecosystem.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can interrupt the fish spawning by cutting causing some eggs to sink, which harms the ecosystem.",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier can slow the flow of the water which cause some fish's eggs to sink which can be a problem for fish eggs."
        ], true)
      end

      it '#long plagiarism cases' do
        run_benchmark_on_entries("long (151-200 character) plagiarized entries", [
          "A surge barrier in New York City could harm the local ecosystem because it could interrupt the spawning season for many fish and the fish go to new locations to lay their eggs and a surge barrier could block certain fish from getting to their location.",
          "A surge barrier in New York City could harm the local ecosystem because it could interrupt the spawning season for many fish and the fish travel to new locations where they lay their eggs so a surge barrier could block certain fish from getting to their location.",
          'A surge barrier in New York City could harm the local ecosystem because it "could interrupt the spawning season for many fish by blocking certain fish from getting to their spawning locations and safely relasing their eggs.'
        ], false)
      end

      it '#long non-plagiarism cases' do
        run_benchmark_on_entries("long (151-200 character) non-plagiarized entries", [
          "A surge barrier in New York City could harm the local ecosystem because if surge barriers slow the flow of water and fish eggs start sinking, then more and more fish will start to die because they still need oxygen to survive.",
          "A surge barrier in New York City could harm the local ecosystem because in 2019, in the United States Army Corps of Engineers proposed five different options to protect New York against huge hurricane floods like the hurricane that damaged the city during hurricane sandy",
          "A surge barrier in New York City could harm the local ecosystem because interrupt fish reproduce season blocking fish from their habitat, and also make some eggs sink, cause a problem for baby fish that needs oxygen to survive.",
          "A surge barrier in New York City could harm the local ecosystem because interrupt fish reproduce season by blocking fish from their habitat, and also make some eggs sink, cause a problem for baby fish that needs oxygen to survive."
        ], true)
      end
    end
  end
end
