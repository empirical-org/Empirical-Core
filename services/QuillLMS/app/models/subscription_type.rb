# == Schema Information
#
# Table name: subscription_types
#
#  id            :integer          not null, primary key
#  name          :string           not null
#  price         :integer
#  teacher_alias :string
#  created_at    :datetime
#  updated_at    :datetime
#
# Indexes
#
#  index_subscription_types_on_name  (name)
#
require 'newrelic_rpm'
require 'new_relic/agent'

class SubscriptionType < ActiveRecord::Base

  has_many :subscriptions
  validates :name, presence: true

end
