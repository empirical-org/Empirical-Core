module Comprehension
  class Prompt < ApplicationRecord
    include Comprehension::ChangeLog
    
    MIN_TEXT_LENGTH = 10
    MAX_TEXT_LENGTH = 255
    CONJUNCTIONS = %w(because but so)
    DEFAULT_MAX_ATTEMPTS = 5
    MIN_MAX_ATTEMPTS = 3
    MAX_MAX_ATTEMPTS = 6

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

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback, :plagiarism_text, :plagiarism_first_feedback, :plagiarism_second_feedback]
      ))
    end

    def change_log_name
      "Comprehension Stem"
    end

    def url
      activity.url
    end

    def conjunctions
      [conjunction]
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
      if length
        if length < MIN_TEXT_LENGTH
          errors.add(:text, "#{prompt} too short (minimum is #{MIN_TEXT_LENGTH} characters)")
        elsif length > MAX_TEXT_LENGTH
          errors.add(:text, "#{prompt} too long (maximum is #{MAX_TEXT_LENGTH} characters)")
        end
      end
    end
  end
end
