require 'newrelic_rpm'
require 'new_relic/agent'

class SubscriptionType < ActiveRecord::Base

  has_many :subscriptions
  validates :name, presence: true

end
