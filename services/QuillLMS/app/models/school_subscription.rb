# frozen_string_literal: true

# == Schema Information
#
# Table name: school_subscriptions
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  school_id       :integer
#  subscription_id :integer
#
# Indexes
#
#  index_school_subscriptions_on_school_id        (school_id)
#  index_school_subscriptions_on_subscription_id  (subscription_id)
#
class SchoolSubscription < ApplicationRecord
  validates :school_id, :subscription_id, presence: true
  belongs_to :school
  belongs_to :subscription
  after_commit :update_schools_users

  def update_schools_users
    return unless school&.users

    school.users.each do |user|
      UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user, subscription)
    end
  end

end
