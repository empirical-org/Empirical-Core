# == Schema Information
#
# Table name: activity_categories
#
#  id           :integer          not null, primary key
#  name         :string
#  order_number :integer
#  created_at   :datetime
#  updated_at   :datetime
#
FactoryBot.define do
  factory :activity_category do
    sequence(:name) { |n| "Book Title #{n}" }
    sequence(:order_number)
  end
end
