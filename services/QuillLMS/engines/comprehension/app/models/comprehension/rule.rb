module Comprehension
<<<<<<< HEAD
  class Rule < ActiveRecord::Base    
=======
  class Rule < ActiveRecord::Base
>>>>>>> 58e431accea2f7e732c223fb8d967a1a3fcfe391
    MAX_NAME_LENGTH = 50
    ALLOWED_BOOLEANS = [true, false]
    TYPES= [
      TYPE_AUTOML = 'AutoML',
      TYPE_GRAMMAR = 'Grammar',
      TYPE_OPINION = 'Opinion',
      TYPE_PLAGIARISM = 'Plagiarism',
      TYPE_REGEX = 'Regex',
<<<<<<< HEAD
      TYPE_SPELLING = 'Spelling'    
    ]
    before_validation :assign_uid_if_missing     

    has_many :feedbacks, inverse_of: :rule, dependent: :destroy
=======
      TYPE_SPELLING = 'Spelling'
    ]
    before_validation :assign_uid_if_missing

    has_many :feedbacks, inverse_of: :rule
>>>>>>> 58e431accea2f7e732c223fb8d967a1a3fcfe391

    accepts_nested_attributes_for :feedbacks

    validates :uid, presence: true, uniqueness: true
    validates :name, presence: true, length: {maximum: MAX_NAME_LENGTH}
    validates :universal, inclusion: ALLOWED_BOOLEANS
<<<<<<< HEAD
    validates :optimal, inclusion: ALLOWED_BOOLEANS 
    validates :rule_type, inclusion: {in: TYPES}
    validates :suborder, numericality: {only_integer: true, greater_than_or_equal_to: 0}
    validates :concept_uid, presence: true
	
=======
    validates :optimal, inclusion: ALLOWED_BOOLEANS
    validates :rule_type, inclusion: {in: TYPES}
    validates :suborder, numericality: {only_integer: true, greater_than_or_equal_to: 0}
    validates :concept_uid, presence: true

>>>>>>> 58e431accea2f7e732c223fb8d967a1a3fcfe391

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :uid, :name, :description, :universal, :rule_type, :optimal, :suborder, :concept_uid],
        include: [:feedbacks]
      ))
    end

    private def assign_uid_if_missing
      self.uid ||= SecureRandom.uuid
    end
  end
end
