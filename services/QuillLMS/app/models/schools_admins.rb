# frozen_string_literal: true

# == Schema Information
#
# Table name: schools_admins
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  school_id  :integer
#  user_id    :integer
#
# Indexes
#
#  index_schools_admins_on_school_id              (school_id)
#  index_schools_admins_on_school_id_and_user_id  (school_id,user_id) UNIQUE
#  index_schools_admins_on_user_id                (user_id)
#
class SchoolsAdmins < ApplicationRecord
  belongs_to :school
  belongs_to :user

  before_save :set_user_role
  after_save :wipe_cache

  ADMIN_USERS_CACHE_KEY_STEM = 'SERIALIZED_ADMIN_USERS_FOR_'
  DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM = 'SERIALIZED_DISTRICT_ACTIVITY_SCORES_FOR_'
  DISTRICT_CONCEPT_REPORTS_CACHE_KEY_STEM = 'SERIALIZED_DISTRICT_CONCEPT_REPORTS_FOR_'
  DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM = 'SERIALIZED_DISTRICT_STANDARDS_REPORTS_FOR_'
  FREEMIUM_DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM = 'SERIALIZED_FREEMIUM_DISTRICT_STANDARDS_REPORTS_FOR_'

  def admin
    user
  end

  def wipe_cache
    Rails.cache.delete("#{ADMIN_USERS_CACHE_KEY_STEM}#{user_id}")
    Rails.cache.delete("#{DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM}#{user_id}")
    Rails.cache.delete("#{DISTRICT_CONCEPT_REPORTS_CACHE_KEY_STEM}#{user_id}")
    Rails.cache.delete("#{DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{user_id}")
    Rails.cache.delete("#{FREEMIUM_DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{user_id}")
  end

  private def set_user_role
    user.update(role: User::ADMIN) unless user.admin?
  end
end
