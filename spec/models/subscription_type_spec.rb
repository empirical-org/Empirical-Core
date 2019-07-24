require 'rails_helper'

describe SubscriptionType do
  it { should have_many :subscriptions }
  it { should validate_presence_of :name }
end