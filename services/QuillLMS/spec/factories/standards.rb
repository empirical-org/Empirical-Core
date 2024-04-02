# frozen_string_literal: true

# == Schema Information
#
# Table name: standards
#
#  id                   :integer          not null, primary key
#  name                 :string
#  uid                  :string
#  visible              :boolean          default(TRUE)
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  standard_category_id :integer
#  standard_level_id    :integer
#
# Foreign Keys
#
#  fk_rails_...  (standard_category_id => standard_categories.id)
#  fk_rails_...  (standard_level_id => standard_levels.id)
#
FactoryBot.define do
  factory :standard do
    sequence(:name) { |n| "Standard #{n}" }
    standard_level { create(:standard_level) }
    standard_category { StandardCategory.first || create(:standard_category) }

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end

  end
end
