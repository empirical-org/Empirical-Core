# frozen_string_literal: true

# == Schema Information
#
# Table name: skill_groups
#
#  id           :bigint           not null, primary key
#  description  :text
#  name         :string           not null
#  order_number :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
FactoryBot.define do
  factory :skill_group do
    sequence(:name) { |n| "Skill Group #{n}" }
    sequence(:order_number) { |n| n }
  end
end
