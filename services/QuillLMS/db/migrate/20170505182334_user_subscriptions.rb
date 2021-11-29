# frozen_string_literal: true

class UserSubscriptions < ActiveRecord::Migration[4.2]
  def change
    create_table :user_subscriptions do |t|
      t.integer :user_id
      t.integer :subscription_id
      t.timestamps null: false
    end
    add_index :user_subscriptions, :user_id, unique: true
    add_index :user_subscriptions, :subscription_id
  end
end
