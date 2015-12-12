class Subscription < ActiveRecord::Base
  belongs_to :user
  validates :expiration, presence: true
  validates :account_limit, presence: true
end
