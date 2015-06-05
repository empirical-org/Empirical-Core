class Subscription < ActiveRecord::Base
  belongs_to :user
  attr_accessor :expiration, :account_limitÏ
end