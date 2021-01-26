module Comprehension
  class Feedback < ActiveRecord::Base
<<<<<<< HEAD
    MIN_FEEDBACK_LENGTH = 10 
    MAX_FEEDBACK_LENGTH = 500

    belongs_to :rule, inverse_of: :feedbacks
    has_many :highlights, inverse_of: :feedback, dependent: :destroy

    accepts_nested_attributes_for :highlights

    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}
    
=======
    MIN_FEEDBACK_LENGTH = 10
    MAX_FEEDBACK_LENGTH = 500
    belongs_to :rule, inverse_of: :feedbacks

    validates_presence_of :rule
    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}

>>>>>>> 58e431accea2f7e732c223fb8d967a1a3fcfe391
    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :text, :description, :order],
<<<<<<< HEAD
        include: [:highlights]
=======
        include: [],
        methods: []
>>>>>>> 58e431accea2f7e732c223fb8d967a1a3fcfe391
      ))
    end
  end
end
