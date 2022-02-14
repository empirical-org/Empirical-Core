# frozen_string_literal: true

module Evidence
  class Hint < ApplicationRecord
    belongs_to :rule, inverse_of: :hint

    validates_presence_of :explanation
    validates_presence_of :image_link
    validates_presence_of :image_alt_text
    validates_presence_of :rule

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :explanation, :image_link, :image_alt_text, :rule_id]
      ))
    end
  end
end
