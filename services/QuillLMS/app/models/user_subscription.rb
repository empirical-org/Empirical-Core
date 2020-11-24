class UserSubscription < ActiveRecord::Base
  validates :user_id, :subscription_id, presence: true
  belongs_to :user
  belongs_to :subscription
  after_create :send_premium_emails
  after_create :send_analytics

  def self.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user_id, subscription_id)
      if !UserSubscription.where(user_id: user_id, subscription_id: subscription_id).exists?
        # then the user does not have the school subscription yet
        create_user_sub_from_school_sub(user_id, subscription_id)
      end
  end

  def self.create_user_sub_from_school_sub(user_id, subscription_id)
    redeem_present_and_future_subscriptions_for_credit(user_id)
    # create a new user sub pointing at the school
    create(user_id: user_id, subscription_id: subscription_id)
  end

  def send_premium_emails
    if Rails.env.production? || User.find(user_id).email.match('quill.org')
      if subscription.account_type.downcase != 'teacher trial' && subscription.school_subscriptions.empty?
        #if subscription&.account_type&.downcase != 'teacher trial' && subscription&.school_subscriptions&.empty?
        PremiumUserSubscriptionEmailWorker.perform_async(user_id)
      elsif subscription.account_type.downcase != 'teacher trial'
        logger.info("A premium school subscription email is being sent for Subscription #{subscription.id} and User #{user_id}")
        PremiumSchoolSubscriptionEmailWorker.perform_async(user_id)
      end
    end
  end

  def self.redeem_present_and_future_subscriptions_for_credit(user_id)
    # iterate through all remaining subs, converting into credit and expiring
    User.find(user_id).present_and_future_subscriptions.each{|s| s.credit_user_and_de_activate}
  end

  def send_analytics
    PremiumAnalyticsWorker.perform_async(user_id, subscription&.account_type)
  end

end
