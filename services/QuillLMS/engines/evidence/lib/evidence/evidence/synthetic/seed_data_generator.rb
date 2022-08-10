# frozen_string_literal: true

module Evidence
  module Synthetic
    class SeedDataGenerator
      Result = Struct.new(:text, :seed, keyword_init: true)

      WORD_SPLIT_COUNT = 70
      SPACE = ' '
      BLANK = ''
      PERIOD = '.'
      CSV_SUFFIX = '.csv'

      FULL_COUNT = 128
      FULL_NOUN_COUNT = 50
      SECTION_COUNT = 70

      TEMPS_PASSAGE = [1, 0.9, 0.7, 0.5]
      TEMP_SECTION = 0.5 # give a lower temp (creativity) when it has less info

      attr_reader :passage, :stem, :nouns, :results

      # returns a hash of the form {'csv name' => CSVString, 'csv name2' =>...}
      def self.csvs_for_activity(activity_id:, nouns: [])
        activity = Evidence::Activity.find(activity_id)
        passage = activity.passages.first.text
        prompts = activity.prompts
        short_name = activity.title.first(20).gsub(' ', '_')
        passage_csv_name = "#{short_name}_passage_chunks#{CSV_SUFFIX}"

        csvs = {}

        prompts.each.with_index do |prompt, index|
          csv_name = "#{short_name}_#{prompt.conjunction}#{CSV_SUFFIX}"

          generator = new(passage: passage, stem: prompt.text, nouns: nouns)
          generator.run

          csvs[csv_name] = generator.results_csv_string
        end

        # include a csv with a text guide to the passage chunks
        csvs[passage_csv_name] = new(passage: passage, stem: '').text_guide_csv_string

        csvs
      end


      def initialize(passage:, stem:, nouns: [])
        @passage = passage
        @stem = stem
        @nouns = nouns
        @results = []
      end

      def run
        # whole passage plus prompt
        prompt = prompt_text(context: passage)
        TEMPS_PASSAGE.each do |temp|
          run_prompt(prompt: prompt, count: FULL_COUNT, seed: "full_passage_temp#{temp}", temperature: temp)
        end

        # whole passage plus prompt for each noun
        nouns.each do |noun|
          prompt = prompt_text(context: passage, noun: noun)
          run_prompt(prompt: prompt, count: FULL_NOUN_COUNT, noun: noun, seed: "full_passage_noun_#{noun.gsub(SPACE,BLANK)}")
        end

        # chunks plus prompt
        split_passage.each.with_index do |text_chunk, index|
          prompt = prompt_text(context: text_chunk)
          run_prompt(prompt: prompt, count: SECTION_COUNT, seed: "text_chunk_#{index + 1}", temperature: TEMP_SECTION)
        end

        results
      end

      private def run_prompt(prompt:, count:, seed:, noun: nil, temperature: 1)
        output = Evidence::OpenAI::Completion.run(prompt: prompt, count: count, temperature: temperature)
        current_result_texts = results.map(&:text)

        new_results = output
          .map {|s| Result.new(text: noun.nil? ? s.lstrip : [noun, s].join(SPACE), seed: seed)}
          .uniq {|r| r.text }
          .reject {|r| r.text.in?(current_result_texts)}

        @results += new_results
      end

      private def prompt_text(context: BLANK, noun: BLANK)
        (context + (context.last == PERIOD ? '' : PERIOD) + SPACE + stem + SPACE + noun + SPACE).gsub(SPACE + SPACE, SPACE)
      end

      # split passage into words, split words in X-word-length chunks
      # e.g. chunks of 50 words
      private def split_passage(size: WORD_SPLIT_COUNT)
        passage
          .split(SPACE)
          .each_slice(size)
          .map{|s| s.join(SPACE)}
          .map{|s| s.last == PERIOD ? s : (s + PERIOD)} # end it in a period, so stem is new sentence.
      end

      def results_csv(file_path)
        CSV.open(file_path, "w") do |csv|
          csv << ['Text', 'Seed']
          results.each {|r| csv << [r.text, r.seed]}
        end
      end

      def results_csv_string
        CSV.generate do |csv|
          csv << ['Text', 'Seed']
          results.each {|r| csv << [r.text, r.seed]}
        end
      end

      def text_guide_csv(file_path)
        CSV.open(file_path, "w") do |csv|
          csv << ['Index', 'Passage Chunk']
          split_passage.each.with_index {|s,i| csv << [i + 1, s]}
        end
      end

      def text_guide_csv_string
        CSV.generate do |csv|
          csv << ['Index', 'Passage Chunk']
          split_passage.each.with_index {|s,i| csv << [i + 1, s]}
        end
      end
    end
  end
end
