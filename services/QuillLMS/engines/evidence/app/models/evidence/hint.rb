# frozen_string_literal: true

module Evidence
  class Hint < ApplicationRecord
    has_many :rule_hints, dependent: :destroy
    has_many :rules, through: :rule_hints, inverse_of: :hint

    validates_presence_of :explanation
    validates_presence_of :image_link
    validates_presence_of :image_alt_text
    validates_presence_of :name

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :name, :explanation, :image_link, :image_alt_text, :rule_id]
      ))
    end
  end
end
