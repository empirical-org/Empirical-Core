# frozen_string_literal: true

# == Schema Information
#
# Table name: subject_areas
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :subject_area do
    sequence(:name) { |n| "Subject Area #{n}" }
  end
end
