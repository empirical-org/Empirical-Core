# frozen_string_literal: true

# == Schema Information
#
# Table name: concepts
#
#  id             :integer          not null, primary key
#  description    :text
#  explanation    :text
#  name           :string(255)
#  uid            :string(255)      not null
#  visible        :boolean          default(TRUE)
#  created_at     :datetime
#  updated_at     :datetime
#  parent_id      :integer
#  replacement_id :integer
#
FactoryBot.define do
  factory :concept do
    sequence(:name) { |i| "Concept #{i}" }
    uid             { SecureRandom.urlsafe_base64 }

    factory :concept_with_parent do
      parent_id {create(:concept).id}
    end

    factory :concept_with_grandparent do
      parent_id {create(:concept_with_parent).id}
    end
  end
end
