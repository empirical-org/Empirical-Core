class Subscription < ActiveRecord::Base
  belongs_to :user
  validates :expiration, presence: true
  validates :account_limit, presence: true

  def self.start_premium current_user
    subscription = self.find_by_user_id current_user.id
    # if a subscription already exists, we just update it by adding an additional 365 days to the expiration
    if subscription
      subscription.update(expiration: (subscription.expiration + 365), account_limit: 1000, account_type: 'paid')
    else
      self.create(user_id: current_user.id, expiration: (Date.today + 365), account_limit: 1000, account_type: 'paid')
    end
  end

end
