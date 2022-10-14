# frozen_string_literal: true

module Evidence
  module Synthetic
    class SeedDataGenerator < ApplicationService
      Result = Struct.new(:text, :seed, keyword_init: true)

      WORD_SPLIT_COUNT = 70
      SPACE = ' '
      BLANK = ''
      PERIOD = '.'
      CSV_SUFFIX = '.csv'

      FULL_COUNT = ENV.fetch('SYNTHETIC_SEED_PASSAGE_COUNT', 30).to_i
      FULL_NOUN_COUNT = ENV.fetch('SYNTHETIC_SEED_NOUN_COUNT', 50).to_i
      SECTION_COUNT = ENV.fetch('SYNTHETIC_SEED_SECTION_COUNT', 10).to_i

      TEMPS_PASSAGE = [1, 0.7, 0.6, 0.5]
      TEMP_SECTION = 0.4 # give a lower temp (creativity) when it has less info

      CONJUNCTION_SUBS = {
        'so' => ['thus resulting in', 'as a consequence', 'resulting in'],
        'but' => ['nevertheless', 'but the counter argument is that', 'but, according to the passage, the counter argument is that'],
        'because' => ['for the reason that', 'since', 'owing to the fact that', 'the cause of this was']
      }
      CONJUNCTIONS = CONJUNCTION_SUBS.keys
      class InvalidConjunctionError < StandardError; end

      attr_reader :passage, :stem, :conjunction, :nouns, :results

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

          generator = new(
            passage: passage,
            stem: prompt.text,
            conjunction: prompt.conjunction,
            nouns: nouns
          )
          generator.run

          csvs[csv_name] = generator.results_csv_string
        end

        # include a csv with a text guide to the passage chunks
        csvs[passage_csv_name] = new(passage: passage, stem: '', conjunction: 'but').text_guide_csv_string

        csvs
      end

      def initialize(passage:, stem:, conjunction:, nouns: [])
        @passage = Evidence::HTMLTagRemover.run(passage)
        @stem = stem
        @conjunction = conjunction
        @nouns = nouns
        @results = []
        raise InvalidConjunctionError unless conjunction.in?(CONJUNCTIONS)
      end

      def run
        # whole passage plus prompt
        TEMPS_PASSAGE.each do |temp|
          stem_variants_hash.each do |conjunction, stem_variant|
            prompt = prompt_text(context: passage, stem_variant: stem_variant)
            run_prompt(prompt: prompt, count: FULL_COUNT, seed: "full_passage_temp#{temp}_#{conjunction}", temperature: temp)
          end
        end

        # whole passage plus prompt for each noun
        nouns.each do |noun|
          prompt = prompt_text(context: passage, noun: noun)
          run_prompt(prompt: prompt, count: FULL_NOUN_COUNT, noun: noun, seed: "full_passage_noun_#{noun.gsub(SPACE,BLANK)}")
        end

        # chunks plus prompt
        split_passage.each.with_index do |text_chunk, index|
          stem_variants_hash.each do |conjunction, stem_variant|
            prompt = prompt_text(context: text_chunk, stem_variant: stem_variant)
            run_prompt(prompt: prompt, count: SECTION_COUNT, seed: "text_chunk_#{index + 1}_temp#{TEMP_SECTION}_#{conjunction}", temperature: TEMP_SECTION)
          end
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

      private def prompt_text(context: BLANK, noun: BLANK, stem_variant: stem)
        (context + (context.last == PERIOD ? '' : PERIOD) + SPACE + stem_variant + SPACE + noun + SPACE).squish
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

      private def stem_variants_hash
        {conjunction => stem}.merge(stem_alternates_hash)
      end

      private def stem_alternates_hash
        CONJUNCTION_SUBS[conjunction]
          .to_h {|conjunction_alternate| [conjunction_alternate, stem.sub(/(.*)\K#{conjunction}/, conjunction_alternate)]}
      end

      def results_csv_string
        CSV.generate do |csv|
          csv << ['Text', 'Seed']
          results.each {|r| csv << [r.text, r.seed]}
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
