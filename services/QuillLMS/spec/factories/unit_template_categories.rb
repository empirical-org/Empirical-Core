# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_template_categories
#
#  id              :integer          not null, primary key
#  name            :string
#  primary_color   :string
#  secondary_color :string
#
FactoryBot.define do
  factory :unit_template_category do
    sequence(:name) {|i| "Unit Template Category #{i}" }
    primary_color   { "#000000" }
    secondary_color { "#ffffff" }
  end
end
