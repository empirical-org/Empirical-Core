class UserSubscription < ActiveRecord::Base
  validates :user_id, :subscription_id, presence: true
  belongs_to :user
  belongs_to :subscription
  after_commit :send_premium_emails, on: :create

  def self.update_or_create(user_id, subscription_id)
      user_sub = self.find_or_initialize_by(user_id: user_id)
      user_sub.subscription_id = subscription_id
      user_sub.save!
  end

  def self.create_user_sub_from_school_sub(user_id, subscription_id)
      self.redeem_present_and_future_subscriptions_for_credit(user_id)
      # create a new user sub pointing at the school
      self.create(user_id: user_id, subscription_id: subscription_id)
  end

  def send_premium_emails
    if Rails.env.production? || User.find(user_id).email.match('quill.org')
      if subscription.account_type.downcase != 'teacher trial' && subscription.school_subscriptions.empty?
        PremiumUserSubscriptionEmailWorker.perform_async(user_id)
      elsif subscription.account_type.downcase != 'teacher trial'
        PremiumSchoolSubscriptionEmailWorker.perform_async(user_id)
      end
    end
  end

  def self.redeem_present_and_future_subscriptions_for_credit(user_id)
    # iterate through all remaining subs, converting into credit and expiring
    User.find(user_id).present_and_future_subscriptions.each{|s| s.credit_user_and_expire}
  end



end
