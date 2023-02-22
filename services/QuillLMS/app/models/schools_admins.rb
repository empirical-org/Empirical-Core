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

  ADMIN_USERS_CACHE_KEY_STEM = "SERIALIZED_ADMIN_USERS_FOR_"
  DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM = "SERIALIZED_DISTRICT_ACTIVITY_SCORES_FOR_"
  DISTRICT_CONCEPT_REPORTS_CACHE_KEY_STEM = "SERIALIZED_DISTRICT_CONCEPT_REPORTS_FOR_"
  DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM = "SERIALIZED_DISTRICT_STANDARDS_REPORTS_FOR_"

  def admin
    user
  end

  private def set_user_role
    user.update(role: User::ADMIN) unless user.admin?
  end

  private def wipe_cache
    $redis.del("#{ADMIN_USERS_CACHE_KEY_STEM}#{user_id}")
    $redis.del("#{DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM}#{user_id}")
    $redis.del("#{DISTRICT_CONCEPT_REPORTS_CACHE_KEY_STEM}#{user_id}")
    $redis.del("#{DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{user_id}")
  end
end
