# frozen_string_literal: true

class AddStripeInvoiceIdToSubscriptions < ActiveRecord::Migration[5.1]
  def change
    add_column :subscriptions, :stripe_invoice_id, :string
    add_index :subscriptions, :stripe_invoice_id, unique: true
  end
end
