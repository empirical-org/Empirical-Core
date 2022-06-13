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
#  user_ids_allow_list :integer          default([]), not null, is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_app_settings_on_name  (name) UNIQUE
#
require 'zlib'

class AppSetting < ApplicationRecord

  COMPREHENSION = 'comprehension'

  validates :percent_active, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 100
  }

  validates :name, uniqueness: true

  scope :enabled, -> { where(enabled: true) }

  def self.enabled?(name:, user:)
    app_setting = AppSetting.find_by_name(name)
    return false unless app_setting

    app_setting.enabled_for_user?(user)
  end

  def self.all_enabled_for_user(user)
    app_settings = AppSetting.enabled
    app_settings.each_with_object({}) do |app_setting, memo|
      memo[app_setting.name] = app_setting.enabled_for_user?(user)
      memo
    end
  end

  def enabled_for_user?(user)
    return false unless enabled
    return false unless user

    return true if enabled_for_staff && user.staff?

    return true if user_in_rollout_bucket?(user.id)

    return true if user_ids_allow_list.include?(user.id)

    false
  end

  def user_in_rollout_bucket?(user_id)
    Zlib.crc32(name + user_id.to_s).digits.take(2).join.to_i < percent_active
  end

end
