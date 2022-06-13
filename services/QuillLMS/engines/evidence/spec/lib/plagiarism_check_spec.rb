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

        it 'should identify plagiarism when there is a fuzzy match of 3 or less' do
          entry = "This phrase plagiarises from the passage even though it hasTYP a ton of spaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:optimal]).to be(false)
        end

        it 'should not identify plagiarism when there is a fuzzy match greater than the configured threshold' do
          entry = "This phrase plagiarises from the passage even though it hasTYPOTYPO a ton of spaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(feedback[:optimal]).to be(true)
        end

        it 'should generate valid entry and passage highlights when fuzzy matching' do
          entry = "This phrase plagiarises from the passage even though it has a ton of TYPOspaces in it."
          passage = "From the passage even though it has a ton of spaces."

          plagiarism_check = Evidence::PlagiarismCheck.new(entry, passage, feedback, rule)
          feedback = plagiarism_check.feedback_object

          expect(entry).to include(feedback[:highlight][0][:text])
          expect(passage).to include(feedback[:highlight][1][:text])
        end

        it 'should generate the correct highlight even if the matched strings are full of repeated words' do
          entry = 'test ' * 10
          passage = 'test ' * 20

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

      context 'known slow API calls' do
        # rubocop:disable Layout/LineLength
        let(:plagiarism1) { "It seemed like no one wanted to go to Matthew J. Kuss Middle School. In 2005, 200 families were trying to withdraw their kids from the school in Fall River, Massachusetts. The school’s academic performance and attendance rates were consistently among the lowest in the state. Today, Kuss is one of the highest performing public schools in its district, and there’s even a waiting list of students who want to attend. What changed? Kuss extended its school day by two hours—giving students an extra 300 hours of learning time each year. Extending learning and enrichment Education experts who support extended school days think that additional instructional time could lead to increased student performance. For example, eight elementary schools in Washington D.C. extended their hours in 2012. By the end of that school year, seven of those schools had made huge gains in standardized testing scores, with math scores growing by 10.6 percent and reading scores growing by 7.2 percent. Longer days also give students more time to participate in special electives. Students at Kuss learn computer science and robotics, collaborating on projects like automatic pencil dispensers and prototypes for smart homes. Another school in the same district uses its extended hours to teach classes on model rockets, the science of soda, and photography. Students can even raise trout and learn survival skills in a wilderness studies class. Paying the price for extended hours Unlike after-school programs or clubs, these extra hours are required for all students, even those with busy after-school schedules. Critics worry that this mandatory extra time at school is overwhelming for some students. After school days that stretch almost until sunset, students have just a few hours to do their homework, participate in extracurricular activities, and relax. One student who used to spend his afternoons on the basketball court found himself effectively benched by longer school days. “I stopped [playing sports] last year as soon as the whole extended school day started,” he told the Hechinger Report. Keeping schools open longer also isn’t cheap. Some schools might need to secure grants or ask for more money from taxpayers to purchase additional materials and pay their staff for the extra time. One school district that tested longer school days reported an average additional cost of $300,000 per school. A growing movement Despite some resistance, education organizations like the National Center on Time & Learning continue to push for extended school days. Advocacy by education experts has resulted in growing numbers of American students staying in class longer. As of 2016, around 1,500 schools in the United States had implemented extended learning schedules. That number could grow even larger as some states explore lengthening school days to make up for learning losses during the COVID-19 pandemic. Before the bell rings Back at Kuss Middle School, students fill their lengthened school days with 90-minute English, math, and science periods and a rotating menu of electives. While the days are long, many students appreciate how the extended schedule gives more time for unique electives and in-depth class discussions. As one Kuss student told the National Center on Time and Learning, “I think more people are coming to our school because they know that there is at least one thing that will make their middle school years memorable.”" }
        let(:plagiarism2) { "they are filled with tourists because many Native Hawaiians can no longer afford to live in these homes. Tourism is part of the reason food can be so expensive, but it doesn’t stop there. Tourism also makes housing more expensive. Rent in Honolulu, Hawaii, is over 200% higher than the national average. Curious about the less-touristy parts of the islands, more and more non-Native Hawaiian buyers and companies are buying homes in areas like Kailua to use as second homes or rent out to tourists. The more homes that non-Hawaiians buy, the less that are available for Hawaiians—and the more expensive the remaining homes become. While the lack of affordable housing affects all Hawaii residents, Native Hawaiians are disproportionately affected. This is due in part to US colonization. Many Native Hawaiians had their land taken away after the Kingdom of Hawaii was overthrown. Today, only about 20% of Hawaii’s population identifies as Native Hawaiian or Pacific Islander—but this group makes up over half of the islands’ homeless population. Hawaii has the highest cost of living in the nation, meaning that food, housing, clothing, electricity, and other things all cost more in Hawaii than anywhere else in the United States. Moving from the islands to the Las Vegas desert has provided some Native Hawaiians with a better standard of living. However, many feel that there is no substitute for the rich culture they were forced to leave behind." }
        # rubocop:enable Layout/LineLength

        it 'without plagiarism' do
          samples = [
            ["Some education experts have advocated for extended school days, so Unlike after-school progams or clubs, in these extra hours are required for all students ,this even those with busy after-school schedules.", plagiarism1], # 2950ms in prod
            ["Some education experts have advocated for extended school days, so many students appreciate that how the extended to schedule gives more time to unique electives and in depth class of discussions.", plagiarism1], # 2570ms in prod
            ["Some Native Hawaiians are moving to Las Vegas because Hawaii has a higher cost of living in the nation, examples food, housing, clothing, electricity and other individuals cost more in Hawaii than in the United States.", plagiarism2], # 2620ms in prod
            ["Some education experts have advocated for extended school days, so Unlike after-school progams or clubs, in these extra hours are required for all students ,this even those with busy after-school schedules.", plagiarism1] # 3430ms in prod
          ]
          runtime = Benchmark.realtime do
            samples.each do |entry, plagiarism_text|
              expect(Evidence::PlagiarismCheck.new(entry, plagiarism_text, '', rule).feedback_object[:optimal]).to eq(true)
            end
          end
          puts format('Average known slow API non-plagiarized runtime: %<runtime>.3f seconds', {runtime: (runtime / samples.length)})
        end

        it 'with plagiarism' do
          samples = [
            ["Some education experts have advocated for extended school days, so Some education experts have advocated for extended school days, so Back at Kuss Middle school, students fill their lengthened school days with 90-minute English, Math, and science periods and a rotating menu of elective", plagiarism1, false] # 4270ms in prod
          ]
          runtime = Benchmark.realtime do
            samples.each do |entry, plagiarism_text|
              expect(Evidence::PlagiarismCheck.new(entry, plagiarism_text, '', rule).feedback_object[:optimal]).to eq(false)
            end
          end
          puts format('Average known slow API with plagiarized runtime: %<runtime>.3f seconds', {runtime: (runtime / samples.length)})
        end
      end
    end
  end
end
