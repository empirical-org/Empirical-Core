# frozen_string_literal: true

# == Schema Information
#
# Table name: standard_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  uid        :string
#  visible    :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :standard_category do
    sequence(:name) { |i| "Standard Category #{i}" }

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end

  end
end
