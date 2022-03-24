# frozen_string_literal: true

class AddStripeSubscriptionIdToSubscriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :subscriptions, :stripe_subscription_id, :string, unique: true
  end
end
