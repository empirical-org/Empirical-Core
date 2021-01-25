module Comprehension
  class Feedback < ActiveRecord::Base
<<<<<<< HEAD
    MIN_FEEDBACK_LENGTH = 10 
    MAX_FEEDBACK_LENGTH = 500
    belongs_to :rule    

    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}
    
=======
    MIN_FEEDBACK_LENGTH = 10
    MAX_FEEDBACK_LENGTH = 500
    belongs_to :rule, inverse_of: :feedbacks

    validates_presence_of :rule
    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}

>>>>>>> 0b5e51f699b43e3445965b5160b4df63fe2c6c97
    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :text, :description, :order],
        include: [],
        methods: []
      ))
    end
  end
end
