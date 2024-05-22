# frozen_string_literal: true

# == Schema Information
#
# Table name: schools_users
#
#  id        :integer          not null, primary key
#  school_id :integer
#  user_id   :integer
#
# Indexes
#
#  index_schools_users_on_school_id              (school_id)
#  index_schools_users_on_school_id_and_user_id  (school_id,user_id)
#  index_schools_users_on_user_id                (user_id) UNIQUE
#
class SchoolsUsers < ApplicationRecord
  belongs_to :school
  belongs_to :user

  # When a teacher sets their school, we make sure they they have the appropriate subscription type.
  after_save :update_subscriptions
  after_update :school_changed_change_log, if: proc { saved_change_to_attribute?(:school_id) }

  def update_subscriptions
    user&.updated_school(school_id)
  end

  private def school_changed_change_log
    ChangeLog.create({
      action: ChangeLog::USER_ACTIONS[:update],
      changed_record_type: User.name,
      changed_record_id: user_id,
      changed_attribute: User::SCHOOL_CHANGELOG_ATTRIBUTE,
      previous_value: attribute_before_last_save(:school_id),
      new_value: attribute_in_database(:school_id)
    })
  end
end
