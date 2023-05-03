# frozen_string_literal: true

module Evidence
  module Synthetic
    class SeedDataGenerator
      WORD_SPLIT_COUNT = 70
      SPACE = ' '
      BLANK = ''
      PERIOD = '.'
      CSV_SUFFIX = '.csv'

      FULL_COUNT = ENV.fetch('SYNTHETIC_SEED_PASSAGE_COUNT', 50).to_i
      FULL_NOUN_COUNT = ENV.fetch('SYNTHETIC_SEED_NOUN_COUNT', 50).to_i
      SECTION_COUNT = ENV.fetch('SYNTHETIC_SEED_SECTION_COUNT', 25).to_i
      EXAMPLE_COUNT = ENV.fetch('SYNTHETIC_SEED_EXAMPLE_COUNT', 15).to_i

      TEMPS_PASSAGE = [0.8, 0.7, 0.5, 0.4]
      TEMP_NOUN = 0.8
      TEMP_SECTION = 0.4 # give a lower temp (creativity) when it has less info
      TEMP_PARAPHRASE = 1
      OPTIONS_PARAPHRASE = {max_tokens: 40}

      STEM_KEY = '%<stem>s'
      CONJUNCTIONS = [
        SO = 'so',
        BUT = 'but',
        BECAUSE = 'because'
      ]
      # Config for Conjunction alternates
      # Use a plain 'string' for direct swap of conjunction
      # e.g. "It is so" => "It is thus"
      # Use 'Start string %<stem>s end string' for more complex forms
      # e.g. "It is so" => "Because It is thus" via 'Because %<stem>s thus'
      CONJUNCTION_SUBS = {
        SO => ["Since #{STEM_KEY}", "Because #{STEM_KEY}"],
        BUT => ['but the counter argument is that', "Even though #{STEM_KEY}"],
        BECAUSE => ['for the reason that', 'owing to the fact that']
      }

      class InvalidConjunctionError < StandardError; end

      CONJUNCTION_EXCLUSIONS = {
        SO => [/^that/],
        BUT => [],
        BECAUSE => [/^of/],
      }

      attr_reader :passage, :stem, :conjunction, :nouns, :results, :label_configs, :use_passage, :batch

      # returns a hash of the form {'csv name' => CSVString, 'csv name2' =>...}
      def self.csvs_for_activity(activity_id:, nouns: [], conjunctions: nil, label_configs: {}, use_passage: true)
        activity = Evidence::Activity.find(activity_id)
        passage = activity.passages.first.text
        prompts = conjunctions.present? ? activity.prompts.where(conjunction: conjunctions) : activity.prompts
        short_name = activity.title.first(20).gsub(' ', '_')

        csvs = {}

        prompts.each do |prompt|
          batch = Evidence::PromptTextBatch.create(
            type: Evidence::PromptTextBatch::TYPE_SEED,
            prompt: prompt,
            nouns: nouns,
            label_configs: label_configs[prompt.conjunction],
            use_passage: use_passage
          )
          seed_data_generator = new(batch)
          seed_data_generator.run

          csvs[batch.csv_name] = batch.seed_csv_string
        end

        csvs
      end

      def initialize(batch)
        @batch = batch
        @passage = batch.passage
        @stem = batch.stem
        @conjunction = batch.conjunction
        @nouns = batch.nouns
        @label_configs = batch.label_configs
        @use_passage = batch.use_passage
        @results = []
      end

      def run
        if use_passage
          generate_full_passage_responses
          generate_full_passage_noun_responses
          generate_chunk_responses
        end

        generate_label_paraphrases
        batch.save

        results
      end

      # whole passage plus prompt
      private def generate_full_passage_responses
        TEMPS_PASSAGE.each do |temp|
          stem_variants_hash.each do |conjunction, stem_variant|
            prompt = prompt_text(context: passage, stem_variant: stem_variant)
            generator = Evidence::TextGeneration.create(
              type: Evidence::TextGeneration::TYPE_FULL_PASSAGE,
              temperature: temp,
              ml_prompt: prompt,
              source_text: passage,
              conjunction: conjunction,
              stem: stem_variant,
              count: FULL_COUNT
            )
            run_generator(generator)
          end
        end
      end

      # whole passage plus prompt for each noun
      private def generate_full_passage_noun_responses
        return unless nouns.present?

        nouns.each do |noun|
          prompt = prompt_text(context: passage, noun: noun)
          generator = Evidence::TextGeneration.create(
            type: Evidence::TextGeneration::TYPE_FULL_PASSAGE_NOUN,
            temperature: TEMP_NOUN,
            ml_prompt: prompt,
            stem: [stem, noun].join(SPACE),
            source_text: passage,
            noun: noun,
            count: FULL_NOUN_COUNT
          )
          run_generator(generator)
        end
      end

      # chunks plus prompt
      private def generate_chunk_responses
        split_passage.each.with_index do |text_chunk, index|
          stem_variants_hash.each do |conjunction, stem_variant|
            prompt = prompt_text(context: text_chunk, stem_variant: stem_variant)
            generator = Evidence::TextGeneration.create(
              type: Evidence::TextGeneration::TYPE_PASSAGE_CHUNK,
              temperature: TEMP_SECTION,
              ml_prompt: prompt,
              stem: stem_variant,
              source_text: text_chunk,
              conjunction: conjunction,
              index: index + 1,
              count: SECTION_COUNT
            )
            run_generator(generator)
          end
        end
      end

      LABEL_KEY = 'label'
      EXAMPLES_KEY = 'examples'

      private def generate_label_paraphrases
        return unless label_configs.present?

        label_configs.each do |label_config|
          label_config[EXAMPLES_KEY].map(&:strip).uniq.compact.each.with_index do |example, index|
            prompt = Evidence::OpenAI::PARAPHRASE_INSTRUCTION + example
            generator = Evidence::TextGeneration.create(
              type: Evidence::TextGeneration::TYPE_LABEL_EXAMPLE,
              temperature: TEMP_PARAPHRASE,
              ml_prompt: prompt,
              source_text: example,
              label: label_config[LABEL_KEY],
              index: index + 1,
              count: EXAMPLE_COUNT
            )
            run_generator(generator, options: OPTIONS_PARAPHRASE)
          end
        end
      end

      private def run_generator(generator, options: {})
        api_results = Evidence::OpenAI::Completion.run(
          prompt: generator.ml_prompt,
          count: generator.count,
          temperature: generator.temperature,
          options: options
        )

        current_result_texts = results.map(&:text)
        new_results = parse_generator_api_results(api_results, current_texts: current_result_texts, generator: generator)

        @results += new_results
      end

      private def parse_generator_api_results(api_results, current_texts:, generator:)
        api_results
          .map {|s| lowercaser.run(s) }
          .map {|s| [generator.noun, s].join(SPACE).strip }
          .uniq
          .reject {|s| s.in?(current_texts)}
          .reject {|s| regex_exclude?(s) }
          .reject {|s| opinion_api_flagged?(s) }
          .map {|s| batch.prompt_texts.new(text: s, text_generation: generator)}
      end

      private def lowercaser
        @lowercaser ||= Evidence::SafeFirstLowercaser.new(passage)
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
          .to_h {|alternate| [alternate, create_alternate_stem(stem, conjunction, alternate)]}
      end

      private def create_alternate_stem(stem, conjunction, alternate)
        stem_without_conjunction = stem.strip.sub(/#{conjunction}\z/, BLANK)

        if alternate.match(STEM_KEY)
          return format(alternate, stem: stem_without_conjunction).squish
        end

        stem_without_conjunction + alternate
      end

      private def regex_exclude?(text)
        return false if conjunction_exclusions.empty?

        conjunction_exclusions.any?{|regex| regex.match(text.strip) }
      end

      private def opinion_api_flagged?(text)
        response = ::Evidence::Check::Opinion.run(text, ::Evidence::Prompt.new(text: stem), nil)

        response.success? && !response.optimal?
      end

      private def conjunction_exclusions
        CONJUNCTION_EXCLUSIONS[conjunction]
      end
    end
  end
end
