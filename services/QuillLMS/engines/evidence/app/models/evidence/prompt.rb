# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts
#
#  id                    :integer          not null, primary key
#  conjunction           :string(20)
#  first_strong_example  :string           default("")
#  max_attempts          :integer
#  max_attempts_feedback :text
#  second_strong_example :string           default("")
#  text                  :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  activity_id           :integer
#
# Indexes
#
#  index_comprehension_prompts_on_activity_id  (activity_id)
#
module Evidence
  class Prompt < ApplicationRecord
    self.table_name = 'comprehension_prompts'

    include Evidence::ChangeLog

    MIN_TEXT_LENGTH = 10
    MAX_TEXT_LENGTH = 255
    CONJUNCTIONS = %w(because but so)
    DEFAULT_MAX_ATTEMPTS = 5
    MIN_MAX_ATTEMPTS = 3
    MAX_MAX_ATTEMPTS = 6

    OPTIMAL_SAMPLE_COUNT = Evidence::GenAI::SystemPromptBuilder::OPTIMAL_SAMPLE_COUNT
    SUBOPTIMAL_SAMPLE_COUNT = Evidence::GenAI::SystemPromptBuilder::SUBOPTIMAL_SAMPLE_COUNT

    belongs_to :activity, inverse_of: :prompts
    has_many :automl_models, inverse_of: :prompt
    has_many :prompts_rules
    has_many :rules, through: :prompts_rules, inverse_of: :prompts

    after_create :assign_universal_rules
    before_validation :downcase_conjunction
    before_validation :set_max_attempts, on: :create

    validates_presence_of :activity
    validates :text, presence: true
    validates :conjunction, presence: true, inclusion: { in: CONJUNCTIONS }
    validates :max_attempts, inclusion: { in: MIN_MAX_ATTEMPTS..MAX_MAX_ATTEMPTS }

    validate :validate_prompt_text_length, on: [:create, :update]

    scope :conjunction, ->(conjunction) {where(conjunction:)}
    scope :parent_activity_ids, ->(parent_activity_ids) {joins(:activity).where(activity: {parent_activity_id: parent_activity_ids})}

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback, :plagiarism_texts, :plagiarism_first_feedback, :plagiarism_second_feedback, :first_strong_example, :second_strong_example],
        methods: [:optimal_label_feedback]
      ))
    end

    def change_log_name
      "Evidence Stem"
    end

    def url
      activity.url
    end

    def conjunctions
      [conjunction]
    end

    def first_passage = activity.passages.first

    def plagiarism_text
      plagiarism_rule&.plagiarism_texts&.first&.text || ""
    end

    private def plagiarism_rule
      rules&.find_by(rule_type: Evidence::Rule::TYPE_PLAGIARISM)
    end

    def distinct_automl_highlight_texts
      @distinct_automl_highlight_texts ||= rules
        .includes(feedbacks: :highlights)
        .active
        .auto_ml
        .suboptimal
        .map {|r| r.feedbacks.map {|f| f.highlights.map(&:text)}}
        .flatten
        .uniq
    end

    def optimal_samples(limit: OPTIMAL_SAMPLE_COUNT)
      Evidence.feedback_history_class
        .optimal_sample(prompt_id: id, limit:)
    end

    def suboptimal_samples(limit: SUBOPTIMAL_SAMPLE_COUNT, offset: 0)
      Evidence.feedback_history_class
        .suboptimal_sample(prompt_id: id, limit:, offset:)
    end

    def example_sets(optimal: true, limit: 2, offset: SUBOPTIMAL_SAMPLE_COUNT)
      optimal ? [first_strong_example, second_strong_example] : suboptimal_samples(limit:, offset:)
    end

    def optimal_label_feedback
      # we can just grab the first feedback here because all optimal feedback text strings will be the same for any given prompt
      rules.where(optimal: true, rule_type: Evidence::Rule::TYPE_AUTOML).joins("JOIN comprehension_feedbacks ON comprehension_feedbacks.rule_id = comprehension_rules.id").first&.feedbacks&.first&.text
    end

    private def downcase_conjunction
      self.conjunction = conjunction&.downcase
    end

    private def set_max_attempts
      self.max_attempts = max_attempts || DEFAULT_MAX_ATTEMPTS
    end

    private def assign_universal_rules
      Rule.where(universal: true).all.each do |rule|
        unless rules.include?(rule)
          rules.append(rule)
        end
      end
      save!
    end

    private def validate_prompt_text_length
      length = text&.length
      prompt = "#{conjunction} prompt"
      return unless length

      if length < MIN_TEXT_LENGTH
        errors.add(:text, "#{prompt} too short (minimum is #{MIN_TEXT_LENGTH} characters)")
      elsif length > MAX_TEXT_LENGTH
        errors.add(:text, "#{prompt} too long (maximum is #{MAX_TEXT_LENGTH} characters)")
      end
    end
  end
end
