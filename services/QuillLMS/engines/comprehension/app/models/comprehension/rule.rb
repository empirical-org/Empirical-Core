module Comprehension
  class Rule < ActiveRecord::Base
    MAX_NAME_LENGTH = 250
    ALLOWED_BOOLEANS = [true, false]
    TYPES= [
      TYPE_AUTOML = 'autoML',
      TYPE_GRAMMAR = 'grammar',
      TYPE_OPINION = 'opinion',
      TYPE_PLAGIARISM = 'plagiarism',
      TYPE_REGEX_ONE = 'rules-based-1',
      TYPE_REGEX_TWO = 'rules-based-2',
      TYPE_REGEX_THREE = 'rules-based-3',
      TYPE_SPELLING = 'spelling'
    ]
    DISPLAY_NAMES = {
      'rules-based-1': 'Sentence Structure Regex',
      'rules-based-2': 'Post-Topic Regex',
      'rules-based-3': 'Typo Regex',
      'plagiarism': 'Plagiarism'
    }
    before_validation :assign_uid_if_missing

    has_many :feedbacks, inverse_of: :rule, dependent: :destroy
    has_one :plagiarism_text, inverse_of: :rule, dependent: :destroy
    has_many :prompts_rules
    has_many :prompts, through: :prompts_rules, inverse_of: :rules
    has_many :regex_rules, inverse_of: :rule, dependent: :destroy

    accepts_nested_attributes_for :plagiarism_text
    accepts_nested_attributes_for :feedbacks
    accepts_nested_attributes_for :regex_rules

    validates :uid, presence: true, uniqueness: true
    validates :name, presence: true, length: {maximum: MAX_NAME_LENGTH}
    validates :universal, inclusion: ALLOWED_BOOLEANS
    validates :optimal, inclusion: ALLOWED_BOOLEANS
    validates :rule_type, inclusion: {in: TYPES}
    validates :suborder, numericality: {only_integer: true, greater_than_or_equal_to: 0}


    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :uid, :name, :description, :universal, :rule_type, :optimal, :suborder, :concept_uid, :prompt_ids],
        include: [:plagiarism_text, :feedbacks, :regex_rules],
        methods: :prompt_ids
      ))
    end

    def regex_is_passing?(entry)
      regex_rules.none?{ |regex_rule| Regexp.new(regex_rule.regex_text).match(entry) }
    end

    def display_name
      DISPLAY_NAMES[rule_type] || rule_type
    end

    private def assign_uid_if_missing
      self.uid ||= SecureRandom.uuid
    end
  end
end
