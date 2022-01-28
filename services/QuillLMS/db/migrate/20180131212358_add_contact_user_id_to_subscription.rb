# frozen_string_literal: true

class AddContactUserIdToSubscription < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :contact_user_id, :integer
    add_index :subscriptions, :contact_user_id
  end
end
