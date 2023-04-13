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
      :manual_types
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

    def stem
      prompt.text
    end

    def conjunction
      prompt.conjunction
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
  end
end
