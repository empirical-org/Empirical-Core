class Subscription < ActiveRecord::Base
  belongs_to :user
  validates :expiration, presence: true
  validates :account_limit, presence: true

  def self.create_premium current_user
    self.create(user_id: current_user.id, expiration: (Date.today + 365), account_limit: 1000, account_type: 'paid')
  end

end
