# frozen_string_literal: true

module Evidence
  class PromptTextBatch < ApplicationRecord
    # TODO, use STI for this in the future
    self.inheritance_column = :_type_disabled

    CONFIG_ACCESSORS = [
      :nouns,
      :label_configs,
      :use_passage,
      :languages,
      :generators,
      :manual_types,
      :import
    ]

    CSV_SUFFIX = '.csv'

    TYPES = [
      TYPE_SEED = "SeedData",
      TYPE_LABELED = "LabeledData"
    ]

    store :config, accessors: CONFIG_ACCESSORS, coder: JSON

    belongs_to :prompt
    has_one :activity, through: :prompt

    has_many :prompt_texts
    has_many :text_generations, through: :prompt_texts

    validates :type, presence: true
    validates :prompt_id, presence: true

    delegate :conjunction, to: :prompt

    def stem
      prompt.text
    end

    def passage
      @passage ||= Evidence::HTMLTagRemover.run(activity.passages.first&.text)
    end

    def csv_name
      "#{activity.title.first(20).gsub(' ', '_')}_#{prompt.conjunction}#{CSV_SUFFIX}"
    end

    def seed_csv_string
      CSV.generate do |csv|
        csv << ['Text', 'Seed', 'Initial Label']
        prompt_texts.each {|t| csv << [t.text, t.seed_descriptor, t.label]}
      end
    end

    LABEL_FILE = 'synthetic'
    LABEL_ORIGINAL = 'original.csv'
    LABEL_TRAINING = 'automl_upload.csv'
    LABEL_ANALYSIS = 'analysis.csv'

    def csv_file_hash(filename)
      {
        file_name(filename, LABEL_TRAINING) => labeled_training_csv_string,
        file_name(filename, LABEL_ANALYSIS) => labeled_analysis_csv_string,
        file_name(filename, LABEL_ORIGINAL) => CSV.generate {|csv| original_labeled_items.each {|pt| csv << [pt.text, pt.label] }}
      }
    end

    def original_labeled_items
      prompt_texts
        .joins(:text_generation)
        .merge(Evidence::TextGeneration.original)
    end

    def file_name(filename, file_ending)
      [filename.gsub('.csv',''), LABEL_FILE, file_ending].join('_')
    end

    def labeled_training_csv_string
      CSV.generate do |csv|
        labeled_training_csv_rows.each {|row| csv << row }
      end
    end

    def labeled_training_csv_rows
      prompt_texts.map(&:labeled_training_csv_row)
    end

    def labeled_analysis_csv_string
      CSV.generate do |csv|
        csv << ['Text', 'Label', 'Original', 'Changed?', 'Language/Spelling', 'Type']
        labeled_analysis_csv_rows.each {|row| csv << row }
      end
    end

    def labeled_analysis_csv_rows
      prompt_texts.map(&:labeled_analysis_csv_row)
    end

    # expects an array of arrays of the form [[ml_type, text, label],...]
    # matches autoML upload
    def self.import_labeled_csv(prompt_id, csv_array)
      batch = create(type: TYPE_LABELED, prompt_id: prompt_id, import: true)
      import_generation = Evidence::TextGeneration.create(type: Evidence::TextGeneration::TYPE_IMPORT)

      csv_array.each do |array|
        ml_type,text,label = array

        batch.prompt_texts.new(
          text_generation: import_generation,
          text: text,
          label: label,
          ml_type: ml_type
        )
      end

      batch.save
    end
  end
end
