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
require 'rails_helper'

describe SubscriptionType do
  it { should have_many :subscriptions }
  it { should validate_presence_of :name }
end
