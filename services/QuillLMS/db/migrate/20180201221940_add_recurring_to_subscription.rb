# frozen_string_literal: true

class AddRecurringToSubscription < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :recurring, :boolean, default: false
    add_index :subscriptions, :recurring
  end
end
