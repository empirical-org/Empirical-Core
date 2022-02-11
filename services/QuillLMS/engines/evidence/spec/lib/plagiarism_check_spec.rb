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

    context 'skip benchmarking', :benchmarking do
      let(:plagiarism_text) { "At particular times in the year, fish travel to new locations where they lay their eggs. A surge barrier could block certain fish from getting to their spawning locations and safely releasing their eggs. A surge barrier could also slow the flow of the water, causing some eggs to sink. This could pose a problem for fish eggs that need oxygen and must stay on the surface of the water in order to survive."}

      it 'benchmark non-plagiarized cases' do
        non_plagiarized_samples = [
          "A surge barrier in New York City could harm the local ecosystem because it is home to a huge population of marine animals and a  barrier could block a fish from getting to their spawning location to lay eggs and could slow the flow of water.",
          "A surge barrier in New York City could harm the local ecosystem because it is home to a huge population of marine animals.",
          "A surge barrier in New York City could harm the local ecosystem because it could cause many fish from swimming to a certain location and releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it would stop certain fish species from laying their eggs as the fish wouldn't be able to get past the barrier meaning the fish wouldn't lay their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it would stop certain fish species from laying their eggs in New York harbour.",
          "A surge barrier in New York City could harm the local ecosystem because it would disturb the marine life by interrupting spawning season due to the surge barrier blocking their way and slowing the flow of water.",
          "A surge barrier in New York City could harm the local ecosystem because it would disturb the marine life by interrupting spawning season and slowing the flow of water.",
          "A surge barrier in New York City could harm the local ecosystem because it would disturb the marine life.",
          "A surge barrier in New York City could harm the local ecosystem because it interrupts spawning season for fish.",
          "A surge barrier in New York City could harm the local ecosystem because it's bad for fish.",
          "A surge barrier in New York City could harm the local ecosystem because the storm barrier could interrupt the spawning season for many fish by blocking the flow of water causing some eggs to sink and die due to the lack of oxygen from the surface of the water.",
          "A surge barrier in New York City could harm the local ecosystem because the storm barrier could interrupt the spawning season for many fish.",
          "A surge barrier in New York City could harm the local ecosystem because it can hurt the marine animals, for example it could slow the flow of water causing eggs to sink.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish, and this time of the year the fish travel to new places and they lay their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it can hurt the marine animals, for example it could slow the flow of water.",
          "A surge barrier in New York City could harm the local ecosystem because it can hurt the marine animals, for example it could harm the fish eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it can hurt the marine animals, for example it could harm the fish eggs",
          "A surge barrier in New York City could harm the local ecosystem because it can hurt the marine animals.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish."
        ]

        runtime = Benchmark.realtime do
          non_plagiarized_samples.each do |entry|
            Evidence::PlagiarismCheck.new(entry, plagiarism_text, '', rule).feedback_object
          end
        end
        puts format('Average non-plagiarism runtime: %<runtime>.3f seconds', {runtime: (runtime / non_plagiarized_samples.length)})
      end

      it 'benchmarks plagiarism cases' do
        plagiarized_samples = [
          "A surge barrier in New York City could harm the local ecosystem because it could cause many fish from getting to their spawning location and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it could block certain fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish, and this time of the year, fish travel to new locations where they lay their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish, and this particular times in the year, fish travel to new locations where they lay their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish and the surge barrier could certain fish from getting to their spawn locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because they could trap sewage and toxins and they would pose a problem for fish eggs that need oxygen.",
          "A surge barrier in New York City could harm the local ecosystem because it would block certain fish from getting to their spawning locations and releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish, a surge barrier could block certain fish from getting to their spawning locations and safely release their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it could block certain fish from getting to their spawning locations.",
          "A surge barrier in New York City could harm the local ecosystem because it could slow the flow of the water causing some eggs to sink.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could interrupt the spawning season for many fish, the surge barrier could block certain fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because surge barrier could also slow the flow of the water causing the fish eggs to die and also lose their location",
          "A surge barrier in New York City could harm the local ecosystem because surge barrier could also slow the flow of the water causing some eggs to sink this could pose a prpblem for fish eggs that need oxygen and must stay on surface of the water in order to survive",
          "A surge barrier in New York City could harm the local ecosystem because a surge barrier could block certain fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because it could block certain fish from getting to their spawning locations ans safely release their eggs and could slow the flow of the water.",
          "A surge barrier in New York City could harm the local ecosystem because it could harm fish, for example a surge barrier could block fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because there are certain fish that need oxygen and must stay on the surface of the water to survive.",
          "A surge barrier in New York City could harm the local ecosystem because it could harm fish, a surge barrier could block certain fish from getting to their spawning locations and safely releasing their eggs.",
          "A surge barrier in New York City could harm the local ecosystem because the surge barrier could slow the flow of the water causing some eggs to sink.",
          "A surge barrier in New York City could harm the local ecosystem because at particular times in the year, fish travel to new locations where they lay their eggs which get blocked by the surge barrier.",
        ]

        runtime = Benchmark.realtime do
          plagiarized_samples.each do |entry|
            Evidence::PlagiarismCheck.new(entry, plagiarism_text, '', rule).feedback_object
          end
        end
        puts format('Average plagiarism runtime: %<runtime>.3f seconds', {runtime: (runtime / plagiarized_samples.length)})
      end
    end
  end
end
