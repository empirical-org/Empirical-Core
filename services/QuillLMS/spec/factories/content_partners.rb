# frozen_string_literal: true

# == Schema Information
#
# Table name: content_partners
#
#  id          :integer          not null, primary key
#  description :string
#  name        :string           not null
#  visible     :boolean          default(TRUE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
FactoryBot.define do
  factory :content_partner do
    sequence(:name) { |i| "Content Partner #{i}" }
    description { 'Some description' }
  end
end
