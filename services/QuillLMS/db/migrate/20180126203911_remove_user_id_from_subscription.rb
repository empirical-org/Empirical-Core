# frozen_string_literal: true

class RemoveUserIdFromSubscription < ActiveRecord::Migration[4.2]
  def change
    remove_column :subscriptions, :user_id
  end
end
