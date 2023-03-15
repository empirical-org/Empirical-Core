# frozen_string_literal: true

class AddStripeSubscriptionIdToSubscription < ActiveRecord::Migration[6.1]
  def change
    add_column :subscriptions, :stripe_subscription_id, :string

    remove_index :subscriptions, :stripe_invoice_id, unique: true
  end
end
