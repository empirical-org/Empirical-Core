# frozen_string_literal: true

# == Schema Information
#
# Table name: units
#
#  id               :integer          not null, primary key
#  name             :string
#  visible          :boolean          default(TRUE), not null
#  created_at       :datetime
#  updated_at       :datetime
#  unit_template_id :integer
#  user_id          :integer
#
# Indexes
#
#  index_units_on_unit_template_id  (unit_template_id)
#  index_units_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (unit_template_id => unit_templates.id)
#
FactoryBot.define do
  factory :simple_unit, class: 'Unit'

  factory :unit do
    sequence(:name) { |i| "Unit #{i}" }
    user_id         { create(:teacher).id }

    trait :sentence_structure_diagnostic do
      name { 'Sentence Structure Diagnostic' }
    end
  end
end
