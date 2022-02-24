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

  def update_subscriptions
    user&.updated_school(school_id)
  end
end
