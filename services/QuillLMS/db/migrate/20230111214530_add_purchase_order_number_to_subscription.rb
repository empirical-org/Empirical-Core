# frozen_string_literal: true

class AddPurchaseOrderNumberToSubscription < ActiveRecord::Migration[6.1]
  def change
    add_column :subscriptions, :purchase_order_number, :string
  end
end
