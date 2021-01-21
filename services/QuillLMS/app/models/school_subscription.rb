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
class SchoolSubscription < ActiveRecord::Base
  validates :school_id, :subscription_id, presence: true
  belongs_to :school
  belongs_to :subscription
  after_commit :update_schools_users
  after_create :send_premium_emails, :update_subscription

  def update_schools_users
    if school && school.users
      school.users.each do |u|
        UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(u.id, subscription_id)
      end
    end
  end

  def send_premium_emails
    if school && school.users
      if Rails.env.production?
        school.users.each do |u|
          PremiumSchoolSubscriptionEmailWorker.perform_async(u.id)
        end
      else
        school.users.each do |u|
          PremiumSchoolSubscriptionEmailWorker.perform_async(u.id) if u.email.match('quill.org')
        end
      end
    end
  end

  def update_subscription
    if subscription.account_type === 'Purchase Missing School'
      subscription.update(account_type: 'School Paid')
    end
  end

end
