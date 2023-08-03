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
FactoryBot.define do
  factory :evidence_hint do
    name { "Hint Name" }
    explanation { "This is an explanation." }
    image_link { "https://quill.org" }
    image_alt_text { "Text that describes the picture" }
  end
end
