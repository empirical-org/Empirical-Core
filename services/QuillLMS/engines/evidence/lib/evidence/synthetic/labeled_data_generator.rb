# frozen_string_literal: true

module Evidence
  module Synthetic
    class LabeledDataGenerator < ApplicationService
      include ActiveModel::Validations
      include Synthetic::ManualTypes

      CSV_END_MATCH = /\.csv\z/
      SYNTHETIC_CSV = '_with_synthetic_detail.csv'
      TRAIN_CSV = '_training.csv'

      # To add a generator:
      # 1) Subclass Synthetic::Generators::Base
      # 2) Write a 'generate' function (also overwrite 'initialize' if you need passed-in options)
      # 3) Add type and class to this mapping
      GENERATORS = {
        paraphrase: Synthetic::Generators::Paraphrase,
        spelling: Synthetic::Generators::Spelling,
        spelling_passage_specific: Synthetic::Generators::SpellingPassageSpecific
      }

      DEFAULT_GENERATORS = GENERATORS.slice(:paraphrase, :spelling, :spelling_passage_specific)
      TEST_GENERATOR_KEYS = [:spelling_passage_specific]
      FREE_GENERATORS = GENERATORS.except(:paraphrase)

      attr_reader :results, :labels, :generators, :passage, :batch, :prompt

      # params:
      # texts_and_labels: [['text', 'label_5'],['text', 'label_1'],...]
      # manual_types: bool, whether to assign TEXT,VALIDATION,TRAIN to each row
      def initialize(texts_and_labels, prompt:, generators: DEFAULT_GENERATORS.keys, manual_types: false)
        @manual_types = manual_types
        @generators = GENERATORS.slice(*generators)

        @prompt = prompt
        @batch = Evidence::PromptTextBatch.create(
          type: Evidence::PromptTextBatch::TYPE_LABELED,
          prompt: prompt,
          manual_types: manual_types,
          generators: generators
        )

        @passage = @batch.passage

        clean_text_and_labels = labeled_data_cleaner(texts_and_labels)

        @labels = clean_text_and_labels.map(&:last).uniq

        # assign results with no TEST,VALIDATION,TRAIN type
        @results = clean_text_and_labels.map do |text_and_label|
          Synthetic::LabeledResult.new(
            text: text_and_label.first, # text is a unique ID
            label: text_and_label.last,
            generated: []
          )
        end

        assign_types if manual_types
      end

      def run
        run_generators(generators, results_training)

        if manual_types
          run_generators(test_generators, results_test_validation)
        end

        store_results

        self
      end

      def store_results
        original = Evidence::TextGeneration.create(type: Evidence::TextGeneration::TYPE_ORIGINAL)

        results.each do |result|
          batch.prompt_texts.new(
            text: result.text,
            label: result.label,
            ml_type: result.type,
            text_generation: original
          )

          result.generated.each do |generator_results|
            generator_results.results.each do |new_text|
              batch.prompt_texts.new(
                text: new_text,
                label: result.label,
                ml_type: result.type,
                text_generation: generator_results.generator
              )
            end
          end
        end

        batch.save
      end

      # generated
      # {'their originial response' => [Generated(spelling)]}
      def run_generators(generator_hash, results_set)
        generator_hash.each do |type, generator|
          results_hash = generator.run(results_set.map(&:text), passage: passage)

          results_set.each do |result|
            array_for_result = results_hash[result.text] || []
            result.generated.concat(array_for_result)
          end
        end
      end

      def results_training
        return results unless manual_types

        results.select { |r| r.type == TYPE_TRAIN }
      end

      def test_generators
        generators.slice(*TEST_GENERATOR_KEYS)
      end

      def results_test_validation
        return results unless manual_types

        results.select { |r| r.type == TYPE_VALIDATION || r.type == TYPE_TEST }
      end

      LABEL_FILE = 'synthetic'
      LABEL_ORIGINAL = 'original.csv'
      LABEL_TRAINING = 'automl_upload.csv'
      LABEL_ANALYSIS = 'analysis.csv'

      def self.csvs_from_run(texts_and_labels, filename, prompt)
        generator = Evidence::Synthetic::LabeledDataGenerator.new(
          texts_and_labels,
          prompt: prompt,
          manual_types: true
        )

        generator.run

        generator.batch.csv_file_hash(filename)
      end

      private def labeled_data_cleaner(texts_and_labels)
        texts_and_labels
          .keep_if(&:last) # remove blank labels
          .keep_if(&:first) # remove blank texts
          .uniq(&:first) # remove duplicate texts
      end
    end
  end
end
