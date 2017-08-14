class UserSubscription < ActiveRecord::Base
  validates :user_id, :subscription_id, presence: true
  belongs_to :user
  belongs_to :subscription

  def self.update_or_create(user_id, subscription_id)
    user_sub = self.find_or_initialize_by(user_id: user_id)
    user_sub.subscription_id = subscription_id
    user_sub.save!
  end




end
