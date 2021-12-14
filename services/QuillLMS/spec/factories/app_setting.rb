# frozen_string_literal: true

# == Schema Information
#
# Table name: app_settings
#
#  id                  :integer          not null, primary key
#  enabled             :boolean          default(FALSE), not null
#  enabled_for_staff   :boolean          default(FALSE), not null
#  name                :string           not null
#  percent_active      :integer          default(0), not null
#  user_ids_allow_list :string           default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_app_settings_on_name  (name) UNIQUE
#

FactoryBot.define do
  factory :app_setting do
    enabled { false }
    sequence(:name) { |n| "AppSetting-#{n}" }
    percent_active { 10 }
  end
end
