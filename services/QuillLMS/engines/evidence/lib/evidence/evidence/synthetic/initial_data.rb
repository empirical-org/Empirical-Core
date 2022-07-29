# frozen_string_literal: true

module Evidence
  module Synthetic
    class InitialData
      Result = Struct.new(:text, :seed, keyword_init: true)

      WORD_SPLIT_COUNT = 70
      SPACE = ' '
      BLANK = ''
      PERIOD = '.'

      FULL_COUNT = 100
      FULL_NOUN_COUNT = 50
      SECTION_COUNT = 50

      TEMP_PASSAGE = 1
      TEMP_SECTION = 0.5 # give a lower temp (creativity) when it has less info

      attr_reader :passage, :stem, :nouns, :results

      # passage = Evidence::Synthetic::TestConstants::NFL_PASSAGE
      # stem = Evidence::Synthetic::TestConstants::NFL_BECAUSE
      # nouns = Evidence::Synthetic::TestConstants::NFL_NOUNS
      # generator = Evidence::Synthetic::InitialData.new(passage: passage, stem: stem, nouns: nouns)
      # generator.run

      # file_path = "/Users/danieldrabik/Dropbox/quill/synthetic/test_generation_#{Time.current.strftime('%Y-%m-%d-%T')}.csv"
      # generator.to_csv(file_path)

      def initialize(passage:, stem:, nouns: [])
        @passage = passage
        @stem = stem
        @nouns = nouns
        @results = []
      end

      def run
        # whole passage plus prompt
        prompt = prompt_text(context: passage)
        run_prompt(prompt: prompt, count: FULL_COUNT, seed: 'full_passage')

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

      private def run_prompt(prompt:, count:, seed:, noun: nil, temperature: TEMP_PASSAGE)
        output = Evidence::OpenAI.new(prompt: prompt, count: count, temperature: temperature).request
        current_result_texts = results.map(&:text)

        new_results = output
          .map {|s| Result.new(text: noun.nil? ? s.lstrip : [noun, s].join(SPACE), seed: seed)}
          .uniq {|r| r.text }
          .reject {|r| r.text.in?(current_result_texts)}

        @results += new_results
      end

      private def prompt_text(context: BLANK, noun: BLANK)
        context + SPACE + stem + SPACE + noun + SPACE
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

      def to_csv(file_path)
        CSV.open(file_path, "w") do |csv|
          csv << ['Text', 'Seed']
          results.each {|r| csv << [r.text, r.seed]}
        end
      end

      def passages_to_csv(file_path)
        CSV.open(file_path, "w") do |csv|
          csv << ['Index', 'Passage Chunk']
          split_passage.each.with_index {|s,i| csv << [i + 1, s]}
        end
      end
    end
  end
end
