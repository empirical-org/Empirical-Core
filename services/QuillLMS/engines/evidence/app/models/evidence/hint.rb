# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_hints
#
#  id             :bigint           not null, primary key
#  explanation    :string           not null
#  image_link     :string           not null
#  image_alt_text :string           not null
#  rule_id        :bigint
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  name           :text
#
module Evidence
  class Hint < ApplicationRecord
    has_many :rules, inverse_of: :hint

    validates_presence_of :explanation
    validates_presence_of :image_link
    validates_presence_of :image_alt_text
    validates_presence_of :name

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :name, :explanation, :image_link, :image_alt_text]
      ))
    end
  end
end
