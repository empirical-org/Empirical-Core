module Comprehension
  class Rule < ActiveRecord::Base
    MAX_NAME_LENGTH = 50
    ALLOWED_BOOLEANS = [true, false]
    TYPES= [
      TYPE_AUTOML = 'AutoML',
      TYPE_GRAMMAR = 'Grammar',
      TYPE_OPINION = 'Opinion',
      TYPE_PLAGIARISM = 'Plagiarism',
      TYPE_REGEX = 'Regex',
      TYPE_SPELLING = 'Spelling'    
    ]
    # FIXME, add relationships

    validates :uid, presence: true, uniqueness: true
    validates :name, presence: true, length: {maximum: MAX_NAME_LENGTH}
    validates :universal, inclusion: ALLOWED_BOOLEANS
    validates :optimal, inclusion: ALLOWED_BOOLEANS 
    validates :rule_type, inclusion: {in: TYPES}
    validates :suborder, numericality: {only_integer: true, greater_than_or_equal_to: 0}
    validates :concept_uid, presence: true
	

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :uid, :name, :description, :universal, :rule_type, :optimal, :suborder, :concept_uid]
      ))
    end
  end
end
