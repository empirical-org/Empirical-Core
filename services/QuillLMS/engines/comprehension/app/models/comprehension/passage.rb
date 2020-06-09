module Comprehension
  class Passage < ActiveRecord::Base
    MINIMUM_TEXT_LENGTH = 50

    belongs_to :activity, inverse_of: :passages

    validates_presence_of :activity
    validates :text, presence: true, length: {minimum: MINIMUM_TEXT_LENGTH}

    def serializable_hash(options = {})
      super(options.reverse_merge(
        only: [:id, :text]
      ))
    end
  end
end
