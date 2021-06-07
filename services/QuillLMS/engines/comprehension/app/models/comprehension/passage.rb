module Comprehension
  class Passage < ActiveRecord::Base
    include Comprehension::ChangeLog

    MIN_TEXT_LENGTH = 50

    belongs_to :activity, inverse_of: :passages

    validates_presence_of :activity
    validates :text, presence: true, length: {minimum: MIN_TEXT_LENGTH}

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :text, :image_link, :image_alt_text]
      ))
    end

    def log_update(user_id)
      log_change(user_id, :update_passage, self.activity, nil, nil, text_change[0], text_change[1])
    end
  end
end
