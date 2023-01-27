# frozen_string_literal: true

class RemoveSubscriptionStripeInvoiceIdIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :subscriptions, :stripe_invoice_id
  end
end
