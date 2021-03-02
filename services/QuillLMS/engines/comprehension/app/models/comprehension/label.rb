module Comprehension
  class Label < ActiveRecord::Base
    NAME_MIN_LENGTH = 3
    NAME_MAX_LENGTH = 50

    attr_readonly :name

    belongs_to :rule, inverse_of: :label

    validates :rule, presence: true, uniqueness: true
    validates :name, presence: true, length: {in: NAME_MIN_LENGTH..NAME_MAX_LENGTH}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :name, :rule_id]
      ))
    end
  end
end
