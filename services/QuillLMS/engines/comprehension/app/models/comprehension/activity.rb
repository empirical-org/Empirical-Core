module Comprehension
  class Activity < ActiveRecord::Base
    MIN_TARGET_LEVEL = 1
    MAX_TARGET_LEVEL = 12
    MIN_TITLE_LENGTH = 5
    MAX_TITLE_LENGTH = 100
    MAX_SCORED_LEVEL_LENGTH = 100

    validates :quill_activity_id, presence: true, uniqueness: {allow_nil: true}
    validates :target_level, presence: true,
      numericality: {
        only_integer: true,
        less_than_or_equal_to: MAX_TARGET_LEVEL,
        greater_than_or_equal_to: MIN_TARGET_LEVEL
      }
    validates :title, presence: true, length: {in: MIN_TITLE_LENGTH..MAX_TITLE_LENGTH}
    validates :scored_level, length: { maximum: MAX_SCORED_LEVEL_LENGTH, allow_nil: true}


    def serializable_hash(options = {})
      super(options.reverse_merge(
        only: [:quill_activity_id, :title, :target_level, :scored_level]
      ))
    end
  end
end
